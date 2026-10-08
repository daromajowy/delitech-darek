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
PHP = '/opt/alt/php84/usr/bin/php'
WEB = Path('/home/horcwnciix/domains/intelispaces.pl/public_html')
URL = 'https://knx.intelispaces.pl'
REQUIRED = {'artisan', 'composer.lock', 'vendor/autoload.php', 'public/planner/.vite/manifest.json',
            'app/Http/Controllers/PlannerController.php', 'resources/views/planner.blade.php'}


def configure_target(work):
    global WEB, URL
    config = json.loads((work / 'config.json').read_text())
    root, _ = common.deployment_target(config)
    if config.get('knx_root') != str(root / 'knx/app') or config.get('knx_url') != 'https://knx.intelispaces.pl':
        raise ValueError('Unexpected KNX target')
    WEB = root
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
    app = WEB / 'knx/app'
    if (app.is_symlink() or not (app / '.env').is_file() or (app / 'storage').is_symlink()
            or not (app / 'storage').is_dir() or 'Require all denied' not in (app / '.htaccess').read_text()):
        raise ValueError('Unexpected KNX installation')
    if (app / 'storage/framework/down').exists():
        raise ValueError('Another KNX maintenance is active')
    validate_archive(archive, commit)
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    candidate = WEB / 'knx' / ('.knx-next-' + stamp)
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
        output.write('\nRequire all granted\n')
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
        # Compile caches only after the application reaches its permanent path.
        common.command([PHP, str(app / 'artisan'), 'config:cache'])
        common.command([PHP, str(app / 'artisan'), 'view:cache'])
        common.command([PHP, str(app / 'artisan'), 'up'])
        health()
        marker = {'schema': 2, 'kind': 'knx', 'commit': commit, 'deployed_at': datetime.now(timezone.utc).isoformat()}
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
    import fcntl
    parser = argparse.ArgumentParser()
    parser.add_argument('--work', required=True)
    args = parser.parse_args()
    work = Path(args.work).resolve()
    if work != Path('/home/horcwnciix/intelispaces-deploy'):
        raise ValueError('Unexpected deployment directory')
    configure_target(work)
    with (work / 'knx-deploy.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        if (work / 'PAUSED').exists() or (work / 'KNX_PAUSED').exists():
            return
        api = 'https://api.github.com/repos/daromajowy/delitech-darek'
        commit = common.read_json(api + '/git/ref/heads/main')['object']['sha']
        if not re.fullmatch(r'[0-9a-f]{40}', commit):
            raise ValueError('Invalid main commit')
        state = work / 'deployed-knx.json'
        if state.exists() and json.loads(state.read_text())['commit'] == commit:
            return
        try:
            release = common.read_json(api + '/releases/tags/cf-' + commit)
        except urllib.error.HTTPError as error:
            if error.code == 404:
                return
            raise
        if release.get('draft') or release.get('tag_name') != 'cf-' + commit:
            raise ValueError('Unexpected release')
        assets = {asset['name'] for asset in release['assets']}
        if not {'knx.tar.gz', 'knx.sha256'} <= assets:
            return
        base = 'https://github.com/daromajowy/delitech-darek/releases/download/cf-' + commit + '/'
        checksum = common.download(base + 'knx.sha256', 256).decode('ascii').split()[0]
        data = common.download(base + 'knx.tar.gz', 130 * 1024 * 1024)
        if not re.fullmatch(r'[a-f0-9]{64}', checksum) or hashlib.sha256(data).hexdigest() != checksum:
            raise ValueError('KNX archive checksum differs')
        archive = work / 'incoming-knx.tar.gz'
        archive.write_bytes(data)
        validate_archive(archive, commit)
        if common.read_json(api + '/git/ref/heads/main')['object']['sha'] != commit:
            return
        apply_release(work, archive, commit)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(datetime.now(timezone.utc).isoformat() + ' KNX_DEPLOY_FAILED ' + str(error), flush=True)
        raise SystemExit(1)
