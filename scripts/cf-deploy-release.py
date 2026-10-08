"""Pull main to staging; production accepts only an explicit GitHub promotion."""
import argparse
from datetime import datetime, timezone
import hashlib
import importlib.util
import json
from pathlib import Path
import re
import urllib.error


def load(name, filename):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(filename))
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


site = load('static_release', 'cf-deploy-static.py')
knx = load('knx_release', 'cf-deploy-knx.py')
API = 'https://api.github.com/repos/daromajowy/delitech-darek'


def validate_promotion(deployment):
    payload = deployment.get('payload')
    if isinstance(payload, str):
        payload = json.loads(payload)
    if (not isinstance(payload, dict) or payload.get('schema') != 1
            or payload.get('source') != 'staging' or payload.get('workflow') != 'promote.yml'
            or deployment.get('environment') != 'production' or deployment.get('task') != 'intelispaces-promote'
            or deployment.get('production_environment') is not True
            or deployment.get('creator', {}).get('login') != 'github-actions[bot]'
            or not isinstance(deployment.get('id'), int) or deployment['id'] <= 0
            or not re.fullmatch(r'[a-f0-9]{40}', str(payload.get('commit', '')))
            or deployment.get('sha') != payload['commit']):
        raise ValueError('Invalid manual promotion record')
    hashes = payload.get('archives', {})
    if set(hashes) != {'site', 'knx'} or any(not re.fullmatch(r'[a-f0-9]{64}', str(value)) for value in hashes.values()):
        raise ValueError('Promotion does not identify both tested archives')
    return {'commit': payload['commit'], 'request_id': deployment['id'], 'archives': hashes}


def desired_release(config):
    site.deployment_target(config)
    if config['environment'] == 'staging':
        commit = site.read_json(API + '/git/ref/heads/main')['object']['sha']
        if not re.fullmatch(r'[a-f0-9]{40}', commit):
            raise ValueError('Invalid main commit')
        return {'commit': commit, 'request_id': None, 'archives': None}
    deployments = site.read_json(API + '/deployments?environment=production&task=intelispaces-promote&per_page=1')
    if not deployments:
        return None
    return validate_promotion(deployments[0])


def promotion_is_active(desired):
    if desired['request_id'] is None:
        return True
    statuses = site.read_json(API + '/deployments/' + str(desired['request_id']) + '/statuses?per_page=1')
    return bool(statuses) and statuses[0].get('state') in {'queued', 'pending', 'in_progress', 'success'}


def runtime_settings(app):
    script = r'''require 'vendor/autoload.php'; $app=require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$db=config('database.connections.'.config('database.default'));
echo json_encode(['environment'=>config('app.env'),'url'=>config('app.url'),'website'=>config('app.website_url'),
'debug'=>config('app.debug'),'driver'=>$db['driver'],'host'=>$db['host'],'port'=>(string)$db['port'],
'database'=>$db['database'],'username'=>$db['username'],'mailer'=>config('mail.default'),
'cookie'=>config('session.cookie'),'secure_cookie'=>config('session.secure'),'session_domain'=>config('session.domain'),
'key_fingerprint'=>hash('sha256',config('app.key')),'origins'=>config('cors.allowed_origins')]);'''
    return json.loads(site.command([knx.PHP, '-r', script], cwd=app))


def guard_runtime(config):
    _, environment = site.deployment_target(config)
    target = site.TARGETS[environment]
    app = Path(target['knx_root'])
    if (app.is_symlink() or (app / '.env').is_symlink() or (app / 'storage').is_symlink()
            or not (app / '.env').is_file() or not (app / 'storage').is_dir()):
        raise ValueError('Runtime or private storage is missing or linked')
    settings = runtime_settings(app)
    settings['website'] = settings['website'].rstrip('/')
    expected = {'environment': environment, 'url': target['knx_url'], 'website': target['url'].rstrip('/'),
                'debug': False, 'driver': 'mysql', 'host': '127.0.0.1', 'port': '3308',
                'database': target['database'], 'username': target['database'],
                'secure_cookie': True, 'session_domain': None}
    if any(settings.get(key) != value for key, value in expected.items()):
        raise ValueError('Runtime environment, database or URL does not match the deployment target')
    if environment == 'staging':
        production = runtime_settings(Path(site.TARGETS['production']['knx_root']))
        if (settings['key_fingerprint'] == production['key_fingerprint'] or settings['mailer'] != 'log'
                or settings['cookie'] != '__Host-knx_staging_session'
                or settings['origins'] != ['https://staging.intelispaces.pl']):
            raise ValueError('Staging must isolate its key, cookies, form origins and mail transport')


def packages(work, desired):
    commit = desired['commit']
    try:
        release = site.read_json(API + '/releases/tags/cf-' + commit)
    except urllib.error.HTTPError as error:
        if error.code == 404:
            return None
        raise
    required = {'site.tar.gz', 'site.sha256', 'knx.tar.gz', 'knx.sha256'}
    if release.get('draft') or release.get('tag_name') != 'cf-' + commit:
        raise ValueError('Wrong release')
    if not required <= {asset['name'] for asset in release['assets']}:
        return None
    folder = work / 'releases' / commit
    folder.mkdir(parents=True, exist_ok=True, mode=0o700)
    result = {}
    for name, validator in [('site', site.validate_archive), ('knx', knx.validate_archive)]:
        prefix = 'https://github.com/daromajowy/delitech-darek/releases/download/cf-' + commit + '/'
        checksum = site.download(prefix + name + '.sha256', 256).decode('ascii').split()[0]
        if (not re.fullmatch(r'[a-f0-9]{64}', checksum)
                or (desired['archives'] is not None and desired['archives'][name] != checksum)):
            raise ValueError('Release differs from the tested and approved archives')
        archive = folder / (name + '.tar.gz')
        if not archive.exists() or hashlib.sha256(archive.read_bytes()).hexdigest() != checksum:
            data = site.download(prefix + name + '.tar.gz', 130 * 1024 * 1024)
            if hashlib.sha256(data).hexdigest() != checksum:
                raise ValueError('Archive checksum differs')
            archive.write_bytes(data)
        validator(archive, commit)
        result[name] = {'path': archive, 'checksum': checksum}
    return result


def marker_matches(path, config, desired, checksum):
    if not path.is_file():
        return False
    value = json.loads(path.read_text())
    return (value.get('commit') == desired['commit'] and value.get('environment') == config['environment']
            and value.get('archive_sha256') == checksum)


def run(config_path):
    import fcntl
    config_path = config_path.resolve()
    allowed = {Path(value['work']) / 'config.json' for value in site.TARGETS.values()}
    if config_path not in allowed:
        raise ValueError('Unexpected controller configuration path')
    config = json.loads(config_path.read_text())
    root, environment = site.deployment_target(config)
    work = config_path.parent
    if work != Path(site.TARGETS[environment]['work']):
        raise ValueError('Controller directory and environment differ')
    if site.command(['id', '-un']) != 'horcwnciix' or site.command(['hostname']) != 's78.cyber-folks.pl':
        raise ValueError('Wrong host or account')
    with (work / 'release.lock').open('a') as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return
        if (work / 'PAUSED').exists() or (work / 'KNX_PAUSED').exists():
            return
        desired = desired_release(config)
        if desired is None:
            return
        ready = work / 'deployed-release.json'
        if ready.exists():
            previous = json.loads(ready.read_text())
            if previous.get('commit') == desired['commit'] and previous.get('request_id') == desired['request_id']:
                return
        archives = packages(work, desired)
        if archives is None:
            return
        guard_runtime(config)
        if desired_release(config) != desired or not promotion_is_active(desired):
            print('NEWER_RELEASE_REQUESTED; leaving the current installation unchanged', flush=True)
            return
        knx.configure_target(work)
        # Both packages have been checked before touching either application.
        for name, state, deploy in [('knx', 'deployed-knx.json', lambda: knx.apply_release(work, archives['knx']['path'], desired['commit'])),
                                    ('site', 'deployed.json', lambda: site.apply_release(config, work, archives['site']['path'], desired['commit']))]:
            if not marker_matches(work / state, config, desired, archives[name]['checksum']):
                deploy()
        site.verify_http_health(config)
        knx.health()
        marker = {'schema': 1, 'environment': environment, 'status': 'ready', 'commit': desired['commit'],
                  'request_id': desired['request_id'], 'archives': {key: value['checksum'] for key, value in archives.items()},
                  'completed_at': datetime.now(timezone.utc).isoformat()}
        for public in [root, Path(config['knx_root']) / 'public']:
            temporary = public / 'deployment.json.tmp'
            temporary.write_text(json.dumps(marker))
            temporary.replace(public / 'deployment.json')
        # The private receipt is last: a failed public write must be retried.
        temporary = ready.with_suffix('.json.tmp')
        temporary.write_text(json.dumps(marker, indent=2))
        temporary.replace(ready)
        print(environment.upper() + '_READY ' + desired['commit'], flush=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', required=True)
    try:
        run(Path(parser.parse_args().config))
    except Exception as error:
        print(datetime.now(timezone.utc).isoformat() + ' RELEASE_DEPLOY_FAILED ' + str(error), flush=True)
        raise SystemExit(1)
