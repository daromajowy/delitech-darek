"""Validate an explicitly selected staging version; produce a GitHub deployment request."""
import json
import os
from pathlib import Path
import re
import urllib.request

API = 'https://api.github.com/repos/daromajowy/delitech-darek'
STAGING = ['https://staging.intelispaces.pl', 'https://knx-staging.intelispaces.pl']


def fetch(url):
    headers = {'Accept': 'application/vnd.github+json', 'User-Agent': 'InteliSpaces-Promotion/1.0', 'Cache-Control': 'no-cache'}
    if url.startswith(API + '/') and os.environ.get('GH_TOKEN'):
        headers['Authorization'] = 'Bearer ' + os.environ['GH_TOKEN']
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=30) as response:
        data = response.read(2 * 1024 * 1024 + 1)
    if len(data) > 2 * 1024 * 1024:
        raise ValueError('Unexpected promotion response size')
    return data


def read_json(url):
    return json.loads(fetch(url))


def prepare(expected):
    expected = expected.strip().lower()
    if not re.fullmatch(r'[a-f0-9]{7,40}', expected):
        raise ValueError('Paste the version shown on staging (7 to 40 hexadecimal characters)')
    markers = [read_json(url + '/release.json?promotion=' + expected) for url in STAGING]
    commit = markers[0].get('commit', '')
    if not re.fullmatch(r'[a-f0-9]{40}', commit) or not commit.startswith(expected):
        raise ValueError('Staging has changed since the selected test; review its new version before publishing')
    archives = {}
    for marker, name, kind in zip(markers, ['site', 'knx'], ['static', 'knx']):
        if marker.get('environment') != 'staging' or marker.get('commit') != commit or marker.get('kind') != kind:
            raise ValueError('Website and KNX are not on the same staging release')
        digest = marker.get('archive_sha256', '')
        if not re.fullmatch(r'[a-f0-9]{64}', digest):
            raise ValueError('Missing tested archive identity')
        archives[name] = digest
    for url in STAGING:
        paired = read_json(url + '/deployment.json?promotion=' + expected)
        if (paired.get('status') != 'ready' or paired.get('environment') != 'staging'
                or paired.get('commit') != commit or paired.get('archives') != archives):
            raise ValueError('Staging deployment is not complete')
    comparison = read_json(API + '/compare/' + commit + '...main')
    if comparison.get('status') not in {'ahead', 'identical'}:
        raise ValueError('Tested release does not belong to current main history')
    release = read_json(API + '/releases/tags/cf-' + commit)
    if (release.get('draft') or release.get('tag_name') != 'cf-' + commit
            or not {'site.tar.gz', 'site.sha256', 'knx.tar.gz', 'knx.sha256'} <= {asset['name'] for asset in release.get('assets', [])}):
        raise ValueError('Validated release packages are missing')
    for name, digest in archives.items():
        checksum = fetch('https://github.com/daromajowy/delitech-darek/releases/download/cf-' + commit + '/' + name + '.sha256').decode('ascii').split()[0]
        if checksum != digest:
            raise ValueError('Release archive changed after deployment to staging')
    # Re-read both markers at the end to reject an intervening deployment.
    if markers != [read_json(url + '/release.json?promotion=' + expected) for url in STAGING]:
        raise ValueError('Staging changed during approval; repeat after checking the new version')
    return {'ref': commit, 'task': 'intelispaces-promote', 'auto_merge': False, 'required_contexts': [],
            'environment': 'production', 'transient_environment': False, 'production_environment': True,
            'description': 'Manual promotion of tested InteliSpaces Staging ' + commit[:12],
            'payload': {'schema': 1, 'source': 'staging', 'workflow': 'promote.yml', 'commit': commit,
                        'archives': archives, 'approved_by': os.environ.get('GITHUB_ACTOR', ''),
                        'workflow_run_id': os.environ.get('GITHUB_RUN_ID', '')}}


if __name__ == '__main__':
    request = prepare(os.environ.get('EXPECTED_COMMIT', ''))
    Path('build').mkdir(exist_ok=True)
    Path('build/promotion.json').write_text(json.dumps(request))
    if os.environ.get('GITHUB_OUTPUT'):
        with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
            output.write('commit=' + request['ref'] + '\n')
    print('STAGING_READY_FOR_MANUAL_PROMOTION ' + request['ref'])
