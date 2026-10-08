"""Scoped KNX pull deployment on the dedicated CF account. Never restores a database."""
import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import tarfile
import urllib.error
import urllib.parse
import urllib.request

spec = importlib.util.spec_from_file_location('site_deployment', Path(__file__).with_name('cf-deploy-static.py'))
common = importlib.util.module_from_spec(spec)
spec.loader.exec_module(common)
spec = importlib.util.spec_from_file_location('knx_gateway', Path(__file__).with_name('cf-knx-gateway.py'))
gateway = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gateway)
PHP = '/opt/alt/php84/usr/bin/php'
WEB = Path('/home/horcwnciix/domains/intelispaces.pl/public_html')
APP = WEB / 'knx/app'
URL = 'https://knx.intelispaces.pl'
REQUIRED = {'artisan', 'composer.lock', 'vendor/autoload.php', 'public/planner/.vite/manifest.json',
            'app/Http/Controllers/PlannerController.php', 'resources/views/planner.blade.php'}


def configure_target(work):
    global WEB, URL, APP
    config = json.loads((work / 'config.json').read_text())
    root, _ = common.deployment_target(config)
    WEB = root
    APP = Path(config['knx_root'])
    URL = config['knx_url']


def validate_archive(path, commit):
    with tarfile.open(path, 'r:gz') as archive:
        members = archive.getmembers()
        if len(members) > 40000 or sum(m.size for m in members) > 350 * 1024 * 1024:
            raise ValueError('KNX release exceeds limits')
        names = set()
        for member in members:
            p = PurePosixPath(member.name)
            if (not member.isfile() or p.is_absolute() or '..' in p.parts or '\\' in member.name
                    or not p.parts or member.name in names or p.as_posix() != member.name):
                raise ValueError('Unsafe KNX archive entry')
            if p.parts[0] not in {'app', 'bootstrap', 'config', 'database', 'public', 'resources', 'routes', 'vendor',
                                'artisan', 'composer.json', 'composer.lock', 'knx-release.json'}:
                raise ValueError('Unexpected KNX top-level path')
            if (p.name in {'.env', 'auth.json', '.htpasswd', 'hot'} or member.name.startswith(('public/storage/', 'storage/', 'bootstrap/cache/'))
                    or (p.parts[0] == 'database' and not member.name.startswith('database/migrations/'))):
                raise ValueError('Runtime data in KNX release')
            names.add(member.name)
        if not (REQUIRED | {'knx-release.json'}) <= names:
            raise ValueError('Incomplete KNX release')
        manifest = json.load(archive.extractfile('knx-release.json'))
        if manifest.get('schema') != 1 or manifest.get('kind') != 'knx' or manifest.get('commit') != commit:
            raise ValueError('Wrong KNX release identity')
        if set(manifest['files']) != names - {'knx-release.json'}:
            raise ValueError('KNX manifest entries differ')
        for name, digest in manifest['files'].items():
            if hashlib.sha256(archive.extractfile(name).read()).hexdigest() != digest:
                raise ValueError('KNX file checksum differs: ' + name)
        return manifest


def health():
    with urllib.request.urlopen(URL + '/admin/login', timeout=30) as response:
        body = response.read(1024 * 1024).decode('utf-8', 'replace')
        if response.status != 200 or 'password' not in body or 'livewire' not in body:
            raise ValueError('KNX login health check failed')
    request = urllib.request.Request(URL + '/api?api=projects', headers={'Accept': 'application/json'})
    try:
        urllib.request.urlopen(request, timeout=20)
    except urllib.error.HTTPError as error:
        if error.code == 401:
            return
    raise ValueError('Anonymous KNX API access was not rejected')


def apply_release(work, archive, commit):
    if common.command(['id', '-un']) != 'horcwnciix' or common.command(['hostname']) != 's78.cyber-folks.pl':
        raise ValueError('Wrong host or account for KNX')
    app = APP
    if (app.is_symlink() or not (app / '.env').is_file() or (app / 'storage').is_symlink()
            or not (app / 'storage').is_dir() or 'Require all denied' not in (app / '.htaccess').read_text()):
        raise ValueError('Unexpected KNX installation')
    if (app / 'storage/framework/down').exists():
        raise ValueError('Another KNX maintenance is active')
    validate_archive(archive, commit)
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    candidate = app.parent / ('.knx-next-' + stamp)
    candidate.mkdir(mode=0o755)
    (candidate / '.htaccess').write_text('Require all denied\n')
    common.unpack(archive, candidate)
    shutil.copy2(app / '.env', candidate / '.env')
    (candidate / '.env').chmod(0o600)
    (candidate / 'bootstrap/cache').mkdir(parents=True, exist_ok=True)
    for folder in ['app', 'config', 'routes', 'database/migrations']:
        for source in (candidate / folder).rglob('*.php'):
            common.command([PHP, '-l', str(source)])
    with (candidate / 'public/.htaccess').open('a') as output:
        output.write('\nRequire all granted\nDirectoryIndex index.php\nAddHandler application/x-httpd-php84 php\n')
    (candidate / 'public/.user.ini').write_text('upload_max_filesize=12M\npost_max_size=24M\ndisplay_errors=Off\n')
    backup = work / 'knx-backups' / (stamp + '-' + commit[:12])
    backup.mkdir(parents=True, mode=0o700)
    common.command([PHP, str(app / 'artisan'), 'down', '--retry=30'])
    swapped = False
    try:
        common.command([PHP, str(app / 'artisan'), 'knx:backup-database', str(backup)])
        with tarfile.open(backup / 'private-files.tar.gz', 'w:gz') as saved:
            saved.add(app / 'storage/app', arcname='storage-app')
            saved.add(app / '.env', arcname='environment.env')
        import gzip
        with gzip.open(backup / 'private-files.tar.gz', 'rb') as saved:
            while saved.read(1024 * 1024):
                pass
        (backup / 'SHA256SUMS').write_text(''.join(hashlib.sha256((backup / name).read_bytes()).hexdigest() + '  ' + name + '\n'
                                                   for name in ['database.sql', 'private-files.tar.gz']))
        shutil.copytree(app / 'storage', candidate / 'storage')
        common.command([PHP, str(candidate / 'artisan'), 'migrate', '--force', '--no-interaction'])
        app.rename(backup / 'application-previous')
        swapped = True
        candidate.rename(app)
        gateway.install(app, URL)
        # Compile caches only after the application reaches its permanent path.
        common.command([PHP, str(app / 'artisan'), 'config:cache'])
        common.command([PHP, str(app / 'artisan'), 'view:cache'])
        common.command([PHP, str(app / 'artisan'), 'up'])
        health()
        config = json.loads((work / 'config.json').read_text())
        marker = {'schema': 2, 'kind': 'knx', 'commit': commit, 'environment': config['environment'],
                  'archive_sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
                  'deployed_at': datetime.now(timezone.utc).isoformat()}
        (app / 'public/release.json').write_text(json.dumps(marker))
        (work / 'deployed-knx.json').write_text(json.dumps(marker, indent=2))
        print('KNX_DEPLOYED ' + commit, flush=True)
    except BaseException:
        if swapped:
            if app.exists():
                # A request may have completed between `up` and a failed health check.
                # Preserve its files as well as the unchanged production database.
                common.command([PHP, str(app / 'artisan'), 'down', '--retry=30'])
                shutil.copytree(app / 'storage/app', backup / 'application-previous/storage/app', dirs_exist_ok=True)
                app.rename(backup / 'application-failed')
            (backup / 'application-previous').rename(app)
        common.command([PHP, str(app / 'artisan'), 'up'])
        raise


def main():
    # Compatibility entry point: production still goes through the promotion gate.
    import importlib.util
    parser = argparse.ArgumentParser()
    parser.add_argument('--work', required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location('paired_release', Path(__file__).with_name('cf-deploy-release.py'))
    controller = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(controller)
    controller.run(Path(args.work) / "config.json")


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(datetime.now(timezone.utc).isoformat() + ' KNX_DEPLOY_FAILED ' + str(error), flush=True)
        raise SystemExit(1)
