"""Deploy validated main releases to the dedicated InteliSpaces account."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import tarfile
import tempfile
import urllib.error
import urllib.request

ROOT = Path('/home/horcwnciix/domains/intelispaces.pl/public_html')
WORK = Path('/home/horcwnciix/intelispaces-deploy')
URL = 'https://intelispaces.pl/'
TOP_LEVEL = {'index.html', '404.html', 'robots.txt', 'sitemap.xml', '.htaccess', 'assets', 'media',
             'architects', 'homes', 'offices', 'about', 'team', 'projects', 'solutions', 'knowledge', 'knx', 'contact'}
REQUIRED = {'index.html', '.htaccess', 'robots.txt', 'sitemap.xml', '404.html'} | {
    name + '/index.html' for name in ['architects', 'homes', 'offices', 'about', 'team', 'projects', 'solutions', 'knowledge', 'knx', 'contact']}
MANAGED = (TOP_LEVEL - {'knx'}) | {'knx/index.html', 'static-manifest.json'}


def deployment_target(config):
    if (config.get('application') != 'static-laravel' or config.get('root') != str(ROOT)
            or config.get('url') != URL or config.get('environment') != 'production'
            or config.get('repository') != 'daromajowy/delitech-darek' or config.get('branch') != 'main'):
        raise ValueError('Unexpected deployment target or source')
    return ROOT, 'production'


def command(args, cwd=None):
    result = subprocess.run(args, cwd=cwd, text=True, capture_output=True, timeout=120)
    if result.returncode:
        raise RuntimeError('Command failed: ' + args[0] + ': ' + (result.stderr or result.stdout)[-1200:])
    return result.stdout.strip()


def download(url, limit=2 * 1024 * 1024):
    request = urllib.request.Request(url, headers={'User-Agent': 'InteliSpaces-CF-Deploy/2.0', 'Accept': 'application/vnd.github+json'})
    with urllib.request.urlopen(request, timeout=45) as response:
        data = response.read(limit + 1)
    if len(data) > limit:
        raise ValueError('Download exceeds size limit')
    return data


def read_json(url):
    return json.loads(download(url))


def validate_archive(path, commit):
    with tarfile.open(path, 'r:gz') as archive:
        members = archive.getmembers()
        if len(members) > 3000 or sum(m.size for m in members) > 180 * 1024 * 1024:
            raise ValueError('Static release exceeds limits')
        names = set()
        for member in members:
            p = PurePosixPath(member.name)
            if (not member.isfile() or p.is_absolute() or '..' in p.parts or '\\' in member.name
                    or not p.parts or member.name in names or p.as_posix() != member.name
                    or (member.name != 'release.json' and p.parts[0] not in TOP_LEVEL)):
                raise ValueError('Unsafe static archive entry')
            if p.suffix.lower() in {'.php', '.phtml', '.sql', '.log'} or any(part.startswith('.') for part in p.parts if part != '.htaccess'):
                raise ValueError('Runtime or hidden data in static release')
            if p.name == '.htaccess' and member.name != '.htaccess':
                raise ValueError('Nested server configuration is not permitted')
            if p.parts[0] == 'knx' and member.name != 'knx/index.html':
                raise ValueError('Only the public KNX information page belongs to the static site')
            names.add(member.name)
        if not (REQUIRED | {'release.json'}) <= names:
            raise ValueError('Incomplete static release')
        manifest = json.load(archive.extractfile('release.json'))
        if manifest.get('schema') != 2 or manifest.get('kind') != 'static' or manifest.get('commit') != commit:
            raise ValueError('Wrong static release identity')
        if set(manifest['files']) != names - {'release.json'}:
            raise ValueError('Static manifest differs')
        for name, digest in manifest['files'].items():
            if hashlib.sha256(archive.extractfile(name).read()).hexdigest() != digest:
                raise ValueError('Static file checksum differs: ' + name)
        return manifest


def unpack(path, destination):
    with tarfile.open(path, 'r:gz') as archive:
        for member in archive.getmembers():
            output = destination / member.name
            output.parent.mkdir(parents=True, exist_ok=True)
            output.write_bytes(archive.extractfile(member).read())
            output.chmod(0o644)


def verify_http_health(config):
    deployment_target(config)
    with urllib.request.urlopen(URL, timeout=30) as response:
        body = response.read(1024 * 1024).decode('utf-8', 'replace')
        if (response.status != 200 or response.url.rstrip('/') != URL.rstrip('/')
                or '__INTELISPACES__' not in body or 'id="root"' not in body or '/wp-content/' in body):
            raise ValueError('Static site health check failed')


def apply_release(config, work, archive, commit):
    root, _ = deployment_target(config)
    if command(['id', '-un']) != 'horcwnciix' or command(['hostname']) != 's78.cyber-folks.pl':
        raise ValueError('Wrong host or account')
    if (root / 'wp-config.php').exists():
        raise ValueError('Retire WordPress before automatic static deployment')
    validate_archive(archive, commit)
    stamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
    backup = work / 'backups' / (stamp + '-' + commit[:12])
    backup.mkdir(parents=True, mode=0o700)
    with tempfile.TemporaryDirectory(prefix='static-', dir=work) as folder:
        prepared = Path(folder)
        unpack(archive, prepared)
        (prepared / 'release.json').rename(prepared / 'static-manifest.json')
        names = MANAGED
        with tarfile.open(backup / 'site-before.tar.gz', 'w:gz') as saved:
            for name in sorted(names | {'release.json'}):
                current = root / name
                if current.is_symlink():
                    raise ValueError('Unexpected symbolic link in static site')
                if current.exists():
                    saved.add(current, arcname=name)
        import gzip
        with gzip.open(backup / 'site-before.tar.gz', 'rb') as saved:
            while saved.read(1024 * 1024):
                pass
        (backup / 'SHA256SUMS').write_text(hashlib.sha256((backup / 'site-before.tar.gz').read_bytes()).hexdigest() + '  site-before.tar.gz\n')
        swapped, installed = [], []
        try:
            for name in sorted(names):
                current, candidate = root / name, prepared / name
                if current.exists():
                    (backup / name).parent.mkdir(parents=True, exist_ok=True)
                    current.rename(backup / name)
                    swapped.append(name)
                if candidate.exists():
                    current.parent.mkdir(parents=True, exist_ok=True)
                    candidate.rename(current)
                    installed.append(name)
            verify_http_health(config)
            marker = {'schema': 2, 'kind': 'static', 'commit': commit, 'deployed_at': datetime.now(timezone.utc).isoformat()}
            (root / 'release.json').write_text(json.dumps(marker))
            (work / 'deployed.json').write_text(json.dumps(marker, indent=2))
            print('STATIC_DEPLOYED ' + commit, flush=True)
        except BaseException:
            for name in installed:
                (backup / ('failed-' + name)).parent.mkdir(parents=True, exist_ok=True)
                (root / name).rename(backup / ('failed-' + name))
            for name in swapped:
                (backup / name).rename(root / name)
            raise


def main():
    import fcntl
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    args = parser.parse_args()
    config_path = Path(args.config).resolve()
    if config_path != WORK / 'config.json':
        raise ValueError('Unexpected configuration path')
    config = json.loads(config_path.read_text())
    deployment_target(config)
    with (WORK / 'deploy.lock').open('w') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        if (WORK / 'PAUSED').exists():
            return
        api = 'https://api.github.com/repos/daromajowy/delitech-darek'
        commit = read_json(api + '/git/ref/heads/main')['object']['sha']
        if not re.fullmatch(r'[a-f0-9]{40}', commit):
            raise ValueError('Invalid main SHA')
        state = WORK / 'deployed.json'
        if state.exists() and json.loads(state.read_text()).get('commit') == commit:
            return
        try:
            release = read_json(api + '/releases/tags/cf-' + commit)
        except urllib.error.HTTPError as error:
            if error.code == 404:
                return
            raise
        if release.get('draft') or release.get('tag_name') != 'cf-' + commit:
            raise ValueError('Unexpected release')
        if not {'site.tar.gz', 'site.sha256'} <= {asset['name'] for asset in release['assets']}:
            return
        base = 'https://github.com/daromajowy/delitech-darek/releases/download/cf-' + commit + '/'
        checksum = download(base + 'site.sha256', 256).decode('ascii').split()[0]
        data = download(base + 'site.tar.gz', 100 * 1024 * 1024)
        if not re.fullmatch(r'[a-f0-9]{64}', checksum) or hashlib.sha256(data).hexdigest() != checksum:
            raise ValueError('Static archive checksum differs')
        archive = WORK / 'incoming.tar.gz'
        archive.write_bytes(data)
        validate_archive(archive, commit)
        if read_json(api + '/git/ref/heads/main')['object']['sha'] == commit:
            apply_release(config, WORK, archive, commit)


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(datetime.now(timezone.utc).isoformat() + ' STATIC_DEPLOY_FAILED ' + str(error), flush=True)
        raise SystemExit(1)
