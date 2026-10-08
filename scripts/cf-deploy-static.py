"""Validated static deployment; main goes to staging, production needs promotion."""
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
TARGETS = {
    'production': {'root': str(ROOT), 'url': URL, 'knx_root': str(ROOT / 'knx/app'),
                   'knx_url': 'https://knx.intelispaces.pl', 'work': str(WORK),
                   'database': 'horcwnciix_knx', 'trigger': 'manual-promotion'},
    'staging': {'root': str(ROOT / 'staging'), 'url': 'https://staging.intelispaces.pl/',
                'knx_root': str(ROOT / 'knx-staging/app'), 'knx_url': 'https://knx-staging.intelispaces.pl',
                'work': '/home/horcwnciix/intelispaces-staging-deploy',
                'database': 'horcwnciix_knxstage', 'trigger': 'main'},
}
TOP_LEVEL = {'index.html', '404.html', 'robots.txt', 'sitemap.xml', '.htaccess', 'assets', 'media',
             'architects', 'homes', 'offices', 'about', 'team', 'projects', 'solutions', 'knowledge', 'knx', 'contact'}
REQUIRED = {'index.html', '.htaccess', 'robots.txt', 'sitemap.xml', '404.html'} | {
    name + '/index.html' for name in ['architects', 'homes', 'offices', 'about', 'team', 'projects', 'solutions', 'knowledge', 'knx', 'contact']}
MANAGED = (TOP_LEVEL - {'knx'}) | {'knx/index.html', 'static-manifest.json'}


def deployment_target(config):
    environment = config.get('environment')
    target = TARGETS.get(environment)
    if (not target or config.get('application') != 'static-laravel'
            or any(config.get(key) != target[key] for key in ['root', 'url', 'knx_root', 'knx_url', 'trigger'])
            or config.get('repository') != 'daromajowy/delitech-darek' or config.get('branch') != 'main'):
        raise ValueError('Unexpected deployment target or source')
    return Path(target['root']), environment


def staging_banner(commit):
    if not re.fullmatch(r'[a-f0-9]{40}', commit):
        raise ValueError('Invalid staging version')
    return ('<details data-staging-banner style="position:fixed;bottom:12px;left:12px;z-index:2147483600;'
            'max-width:calc(100vw - 24px);padding:9px 13px;background:#713f12;color:#fff;border:1px solid #fbbf24;'
            'border-radius:10px;box-shadow:0 3px 16px #0003;font:13px/1.6 system-ui">'
            '<summary style="cursor:pointer;font-weight:700">InteliSpaces Staging · wersja '
            + commit[:12] + '</summary><p style="margin:8px 0">Środowisko testowe · osobna baza · e-maile wyłączone.</p>'
            '<p style="margin:8px 0">Wersja do publikacji: <code style="user-select:all">' + commit[:12]
            + '</code></p><a style="color:#fff;text-decoration:underline" target="_blank" rel="noopener" '
            'href="https://github.com/daromajowy/delitech-darek/actions/workflows/promote.yml">'
            'Publikuj sprawdzoną wersję na produkcji →</a></details>')


def prepare_environment(folder, config, commit):
    """Specialize only URLs and the test label; promote the same immutable archive."""
    _, environment = deployment_target(config)
    if environment != 'staging':
        return
    for file in folder.rglob('*.html'):
        text = file.read_text(encoding='utf-8')
        text = text.replace('https://knx.intelispaces.pl', config['knx_url'])
        text = text.replace('https://intelispaces.pl', config['url'].rstrip('/'))
        text = text.replace('</head>', '<meta name="robots" content="noindex,nofollow,noarchive"></head>')
        text = text.replace('</body>', staging_banner(commit) + '</body>')
        file.write_text(text, encoding='utf-8')
    (folder / 'robots.txt').write_text('User-agent: *\nDisallow: /\n')
    sitemap = folder / 'sitemap.xml'
    sitemap.write_text(sitemap.read_text().replace('https://intelispaces.pl', config['url'].rstrip('/')))
    htaccess = folder / '.htaccess'
    text = htaccess.read_text(encoding='utf-8').replace('https://knx.intelispaces.pl', config['knx_url'])
    text = text.replace('https://intelispaces.pl', config['url'].rstrip('/')).replace('intelispaces\\.pl', 'staging\\.intelispaces\\.pl')
    text += '\n<IfModule mod_headers.c>\nHeader always set X-Robots-Tag "noindex, nofollow, noarchive"\nHeader always set Cache-Control "no-store"\n</IfModule>\n'
    htaccess.write_text(text, encoding='utf-8')


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
    url = config['url']
    with urllib.request.urlopen(url, timeout=30) as response:
        body = response.read(1024 * 1024).decode('utf-8', 'replace')
        if (response.status != 200 or response.url.rstrip('/') != url.rstrip('/')
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
        prepare_environment(prepared, config, commit)
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
            marker = {'schema': 2, 'kind': 'static', 'commit': commit, 'environment': config['environment'],
                      'archive_sha256': hashlib.sha256(archive.read_bytes()).hexdigest(),
                      'deployed_at': datetime.now(timezone.utc).isoformat()}
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
    # Compatibility entry point: production still goes through the promotion gate.
    import importlib.util
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    args = parser.parse_args()
    spec = importlib.util.spec_from_file_location('paired_release', Path(__file__).with_name('cf-deploy-release.py'))
    controller = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(controller)
    controller.run(Path(args.config))


if __name__ == '__main__':
    try:
        main()
    except Exception as error:
        print(datetime.now(timezone.utc).isoformat() + ' STATIC_DEPLOY_FAILED ' + str(error), flush=True)
        raise SystemExit(1)
