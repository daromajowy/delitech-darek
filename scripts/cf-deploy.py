"""CF pull deployment: a validated main release replaces only our theme and plugin.

Install this controller outside public_html. It deliberately never updates itself
from a downloaded release, and never imports a database or copies user uploads.
"""
import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import tarfile
import tempfile
import urllib.error
import urllib.request

MAX_ARCHIVE = 100 * 1024 * 1024
MAX_UNPACKED = 180 * 1024 * 1024
REQUIRED = {'intelispaces/style.css', 'intelispaces/functions.php', 'intelispaces/index.php',
            'intelispaces/dist/.vite/manifest.json', 'intelispaces/templates/home.html',
            'intelispaces-backend/intelispaces-backend.php'}
TARGETS = {
    'staging': ('/home/horcwnciix/domains/horcwnciix.cfolks.pl/public_html/wordpress',
                'https://horcwnciix.cfolks.pl/wordpress/'),
    'production': ('/home/horcwnciix/domains/intelispaces.pl/public_html',
                   'https://intelispaces.pl/'),
}

def deployment_target(config):
    environment = config.get('environment', 'staging')
    expected = TARGETS.get(environment)
    if expected is None or (config.get('root'), config.get('url')) != expected:
        raise ValueError('Unexpected WordPress target or environment')
    return Path(expected[0]), environment

def verify_http_health(config):
    _, environment = deployment_target(config)
    with urllib.request.urlopen(config['url'], timeout=30) as response:
        body = response.read(1024 * 1024).decode('utf-8', 'replace')
        if environment == 'staging':
            if 'wp-login.php' not in response.url or 'user_login' not in body:
                raise ValueError('Staging HTTP health check failed')
        elif (response.status != 200 or response.url.rstrip('/') != config['url'].rstrip('/')
              or '__INTELISPACES__' not in body or 'id="root"' not in body):
            raise ValueError('Production HTTP health check failed')

def download(url, limit=2 * 1024 * 1024):
    request = urllib.request.Request(url, headers={'User-Agent': 'InteliSpaces-CF-Deploy/1.0', 'Accept': 'application/vnd.github+json'})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read(limit + 1)
    if len(data) > limit:
        raise ValueError('Download exceeds size limit')
    return data

def read_json(url):
    return json.loads(download(url))

def validate_archive(path, commit):
    """Validate the entire tar before writing anything, including hashes and traversal."""
    with tarfile.open(path, 'r:gz') as archive:
        members = archive.getmembers()
        if len(members) > 2000 or sum(m.size for m in members) > MAX_UNPACKED:
            raise ValueError('Release exceeds limits')
        names = set()
        for member in members:
            p = PurePosixPath(member.name)
            if (not member.isfile() or p.is_absolute() or '..' in p.parts or '\\' in member.name
                    or not p.parts or member.name in names or p.as_posix() != member.name
                    or (member.name != 'release.json' and p.parts[0] not in {'intelispaces', 'intelispaces-backend'})):
                raise ValueError('Unsafe archive entry: ' + member.name)
            if p.name in {'wp-config.php', '.env'} or p.suffix in {'.sql', '.log'}:
                raise ValueError('Runtime data in release')
            names.add(member.name)
        if not (REQUIRED | {'release.json'}) <= names:
            raise ValueError('Incomplete release')
        manifest = json.load(archive.extractfile('release.json'))
        if manifest.get('schema') != 1 or manifest.get('commit') != commit:
            raise ValueError('Release does not match main commit')
        if set(manifest['files']) != names - {'release.json'}:
            raise ValueError('Manifest entries differ')
        for name, digest in manifest['files'].items():
            if hashlib.sha256(archive.extractfile(name).read()).hexdigest() != digest:
                raise ValueError('File checksum differs: ' + name)
        return manifest

def unpack(path, destination):
    # Called only after validate_archive; do not use tar.extractall on remote data.
    with tarfile.open(path, 'r:gz') as archive:
        for member in archive.getmembers():
            output = destination / member.name
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(archive.extractfile(member).read())
            output.chmod(0o644)

def command(args, cwd=None):
    result = subprocess.run(args, cwd=cwd, text=True, capture_output=True, timeout=90)
    if result.returncode:
        raise RuntimeError('Command failed: ' + args[0] + ': ' + (result.stderr or result.stdout)[-1200:])
    return result.stdout.strip()

def apply_release(config, work, archive, commit):
    expected, environment = deployment_target(config)
    root = Path(config['root']).resolve()
    if root != expected or not (root / 'wp-config.php').is_file():
        raise ValueError('Unexpected WordPress target')
    if command(['id', '-un']) != 'horcwnciix' or command(['hostname']) != 's78.cyber-folks.pl':
        raise ValueError('Wrong host or account')
    wp = ['/usr/local/bin/wp', '--path=' + str(root)]
    if command(wp + ['config', 'get', 'WP_ENVIRONMENT_TYPE']) != environment:
        raise ValueError('WordPress environment differs from the deployment target')
    if command(wp + ['theme', 'list', '--status=active', '--field=name']) != 'intelispaces':
        raise ValueError('Unexpected active theme')
    if (root / '.maintenance').exists():
        raise ValueError('Another maintenance operation is active')
    manifest = validate_archive(archive, commit)
    with tempfile.TemporaryDirectory(prefix='release-', dir=work) as temporary:
        prepared = Path(temporary)
        unpack(archive, prepared)
        for php in prepared.rglob('*.php'):
            command(['/opt/alt/php84/usr/bin/php', '-l', str(php)])
        stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
        backup = work / 'backups' / (stamp + '-' + commit[:12])
        backup.mkdir(parents=True, mode=0o700)
        command(wp + ['db', 'export', str(backup / 'database.sql'), '--defaults'])
        (backup / 'database.sql').chmod(0o600)
        targets = [('intelispaces', root / 'wp-content/themes/intelispaces'),
                   ('intelispaces-backend', root / 'wp-content/plugins/intelispaces-backend')]
        with tarfile.open(backup / 'code.tar.gz', 'w:gz') as saved:
            for name, target in targets:
                if target.is_symlink() or not target.is_dir():
                    raise ValueError('Unexpected deployment directory')
                saved.add(target, arcname=name)
        with tarfile.open(backup / 'code.tar.gz') as saved:
            saved.getmembers()
        (backup / 'SHA256SUMS').write_text(''.join(hashlib.sha256((backup / name).read_bytes()).hexdigest() + '  ' + name + '\n' for name in ['database.sql', 'code.tar.gz']))
        swapped = []
        command(wp + ['maintenance-mode', 'activate'])
        try:
            for name, target in targets:
                previous = backup / (name + '-previous')
                target.rename(previous)
                swapped.append((target, previous))
                (prepared / name).rename(target)
            command(wp + ['eval', 'if (!function_exists("is_cms_config") || !function_exists("is_save_inquiry") || count(is_routes()) !== 11) { exit(3); } echo "CMS_OK";'])
            command(wp + ['maintenance-mode', 'deactivate'])
            verify_http_health(config)
            # Publish the commit marker last, after health checks pass.
            marker = {'schema': 1, 'commit': commit, 'deployed_at': datetime.now(timezone.utc).isoformat()}
            (root / 'wp-content/themes/intelispaces/release.json').write_text(json.dumps(marker), encoding='utf-8')
            (work / 'deployed.json').write_text(json.dumps(marker, indent=2), encoding='utf-8')
            print('DEPLOYED ' + commit, flush=True)
        except BaseException:
            for target, previous in reversed(swapped):
                if target.exists():
                    target.rename(backup / (target.name + '-failed'))
                previous.rename(target)
            command(wp + ['maintenance-mode', 'deactivate'])
            raise

def main():
    import fcntl
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    args = parser.parse_args()
    config_path = Path(args.config).resolve()
    config = json.loads(config_path.read_text())
    work = config_path.parent
    with (work / 'deploy.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        if (work / 'PAUSED').exists():
            return
        if config['repository'] != 'daromajowy/delitech-darek' or config['branch'] != 'main':
            raise ValueError('Unexpected source repository or branch')
        api = 'https://api.github.com/repos/' + config['repository']
        commit = read_json(api + '/git/ref/heads/main')['object']['sha']
        if not re.fullmatch(r'[a-f0-9]{40}', commit):
            raise ValueError('Invalid main SHA')
        state_file = work / 'deployed.json'
        if state_file.exists() and json.loads(state_file.read_text())['commit'] == commit:
            return
        try:
            release = read_json(api + '/releases/tags/cf-' + commit)
        except urllib.error.HTTPError as error:
            if error.code == 404:
                return  # CI has not yet published a validated release for this main commit.
            raise
        if release.get('draft') or release.get('tag_name') != 'cf-' + commit:
            raise ValueError('Unexpected release')
        assets = {asset['name']: asset for asset in release['assets']}
        if not {'site.tar.gz', 'site.sha256'} <= assets.keys():
            return  # Upload still in progress.
        base = 'https://github.com/' + config['repository'] + '/releases/download/cf-' + commit + '/'
        checksum = download(base + 'site.sha256', 256).decode('ascii').split()[0]
        data = download(base + 'site.tar.gz', MAX_ARCHIVE)
        if not re.fullmatch(r'[a-f0-9]{64}', checksum) or hashlib.sha256(data).hexdigest() != checksum:
            raise ValueError('Release checksum differs')
        archive = work / 'incoming.tar.gz'
        archive.write_bytes(data)
        validate_archive(archive, commit)
        # A later push must supersede an in-flight older build.
        if read_json(api + '/git/ref/heads/main')['object']['sha'] != commit:
            return
        apply_release(config, work, archive, commit)

if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(datetime.now(timezone.utc).isoformat() + ' DEPLOY_FAILED ' + str(error), flush=True)
        raise SystemExit(1)
