"""Archive an explicitly approved snapshot of backup branches; never delete a moved ref."""
import argparse
import base64
import json
import os
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parent.parent
PLAN = Path(__file__).with_name('backup-refs-20261008.json')


def operations(plan, remote):
    if plan['repository'] != 'daromajowy/delitech-darek':
        raise ValueError('Unexpected repository')
    creates, deletes = [], []
    for item in plan['backups'] + plan['snapshots']:
        sha, tag = item['sha'], 'refs/tags/' + item['tag']
        if not re.fullmatch(r'[0-9a-f]{40}', sha) or not re.fullmatch(r'archive/[A-Za-z0-9_/-]+', item['tag']):
            raise ValueError('Invalid backup identity')
        if remote.get(tag) not in (None, sha):
            raise ValueError('Archive tag already points elsewhere: ' + tag)
        if tag not in remote:
            creates.append((tag, sha))
        if 'branch' not in item:
            continue
        branch = item['branch']
        if not re.fullmatch(r'(?:backup/|codex/backup-)[A-Za-z0-9_/-]+', branch):
            raise ValueError('Only named backup branches may be archived')
        ref = 'refs/heads/' + branch
        if remote.get(ref) not in (None, sha):
            raise ValueError('Backup branch moved; stop before deletion: ' + branch)
        if ref in remote:
            deletes.append((ref, sha))
    return creates, deletes


def main(dry_run):
    plan = json.loads(PLAN.read_text(encoding='utf-8'))
    if os.environ.get('GITHUB_REPOSITORY', plan['repository']) != plan['repository']:
        raise ValueError('Wrong repository')
    env = dict(os.environ, GIT_TERMINAL_PROMPT='0')
    token = env.pop('GH_TOKEN', None)
    if token:
        # Credentials stay in the process environment, not git config, logs or arguments.
        index = int(env.get('GIT_CONFIG_COUNT', '0'))
        env[f'GIT_CONFIG_KEY_{index}'] = 'http.https://github.com/.extraheader'
        env[f'GIT_CONFIG_VALUE_{index}'] = 'AUTHORIZATION: basic ' + base64.b64encode(('x-access-token:' + token).encode()).decode()
        env['GIT_CONFIG_COUNT'] = str(index + 1)

    def git(*args):
        return subprocess.check_output(['git', *args], cwd=ROOT, env=env, text=True).strip()

    def read_refs():
        return {ref: sha for sha, ref in (line.split() for line in git('ls-remote', '--refs', 'origin').splitlines())}

    expected_url = 'https://github.com/' + plan['repository']
    if git('remote', 'get-url', 'origin').rstrip('/').removesuffix('.git') != expected_url:
        raise ValueError('Unexpected origin')
    creates, deletes = operations(plan, read_refs())
    print(f'{len(creates)} archive tags to create; {len(deletes)} unchanged backup branches to remove.')
    if dry_run:
        return
    for _, sha in creates:
        git('cat-file', '-e', sha + '^{commit}')
    if creates:
        git('push', '--atomic', 'origin', *(sha + ':' + tag for tag, sha in creates))
    refs = read_refs()
    # Every archive must exist at the expected commit before deleting any branch.
    for item in plan['backups'] + plan['snapshots']:
        if refs.get('refs/tags/' + item['tag']) != item['sha']:
            raise ValueError('Archive verification failed: ' + item['tag'])
    _, deletes = operations(plan, refs)
    if deletes:
        git('push', '--atomic', *('--force-with-lease=' + ref + ':' + sha for ref, sha in deletes),
            'origin', *(':' + ref for ref, _ in deletes))
    refs = read_refs()
    if any(ref in refs for ref, _ in deletes):
        raise ValueError('A backup branch remains; inspect remote refs')
    print('Verified: all archived commits remain reachable through their tags.')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--dry-run', action='store_true')
    main(parser.parse_args().dry_run)
