"""Package built Laravel/Filament and React code; never include runtime data."""
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
DIRECTORIES = {'app', 'bootstrap', 'config', 'database/migrations', 'public', 'resources/views', 'routes', 'vendor'}
REQUIRED = {'artisan', 'composer.lock', 'vendor/autoload.php', 'public/planner/.vite/manifest.json',
            'app/Http/Controllers/PlannerController.php', 'resources/views/planner.blade.php'}


def package(commit):
    if not re.fullmatch(r'[0-9a-f]{40}', commit):
        raise ValueError('Expected full commit SHA')
    app = ROOT / 'knx-backend'
    files = {}
    paths = [app / 'artisan', app / 'composer.json', app / 'composer.lock']
    for folder in sorted(DIRECTORIES):
        paths.extend(sorted((app / folder).rglob('*')))
    for path in paths:
        name = path.relative_to(app).as_posix()
        if path.is_symlink():
            raise ValueError('Symlink in KNX build: ' + name)
        if not path.is_file() or path.name == '.gitignore' or name.startswith('bootstrap/cache/'):
            continue
        if path.name in {'.env', 'auth.json', '.htpasswd', 'hot'} or name.startswith(('public/storage/', 'storage/')):
            raise ValueError('Runtime file in KNX package: ' + name)
        files[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    if not REQUIRED <= files.keys():
        raise ValueError('Build planner and install Composer dependencies before packaging')
    manifest = json.dumps({'schema': 1, 'kind': 'knx', 'commit': commit, 'files': files}, separators=(',', ':')).encode()
    output = ROOT / 'build'
    output.mkdir(exist_ok=True)
    archive_path = output / 'knx.tar.gz'
    with tarfile.open(archive_path, 'w:gz') as archive:
        for name in sorted(files):
            archive.add(app / name, arcname=name, recursive=False)
        info = tarfile.TarInfo('knx-release.json')
        info.size, info.mode = len(manifest), 0o644
        archive.addfile(info, io.BytesIO(manifest))
    digest = hashlib.sha256(archive_path.read_bytes()).hexdigest()
    (output / 'knx.sha256').write_text(digest + '  knx.tar.gz\n', encoding='ascii')
    print(f'Packaged KNX: {len(files)} files, commit {commit}, SHA256 {digest}')


if __name__ == '__main__':
    package(os.environ.get('RELEASE_COMMIT') or subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip())
