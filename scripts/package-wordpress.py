"""Package only the custom theme and plugin; no WordPress runtime, database or user uploads."""
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent
REQUIRED = {'intelispaces/style.css', 'intelispaces/functions.php', 'intelispaces/index.php',
            'intelispaces/dist/.vite/manifest.json', 'intelispaces/templates/home.html',
            'intelispaces/media/jung-ls-touch-3-23.mp4', 'intelispaces-backend/intelispaces-backend.php'}

def package(commit):
    if not re.fullmatch(r'[0-9a-f]{40}', commit):
        raise ValueError('Expected full Git commit SHA')
    files = {}
    for folder in ['intelispaces', 'intelispaces-backend']:
        for path in sorted((ROOT / 'wordpress' / folder).rglob('*')):
            if path.is_symlink():
                raise ValueError('Symlinks are not deployment files')
            if path.is_file():
                name = path.relative_to(ROOT / 'wordpress').as_posix()
                if path.suffix in {'.sql', '.log'} or path.name in {'wp-config.php', '.env'}:
                    raise ValueError('Private runtime file in theme/plugin')
                files[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    if not REQUIRED <= files.keys():
        raise ValueError('Build WordPress before packaging')
    manifest = json.dumps({'schema': 1, 'commit': commit, 'files': files}, indent=2).encode()
    output = ROOT / 'build'
    output.mkdir(exist_ok=True)
    archive_path = output / 'site.tar.gz'
    with tarfile.open(archive_path, 'w:gz') as archive:
        for name in files:
            archive.add(ROOT / 'wordpress' / name, arcname=name, recursive=False)
        info = tarfile.TarInfo('release.json')
        info.size, info.mode = len(manifest), 0o644
        archive.addfile(info, io.BytesIO(manifest))
    digest = hashlib.sha256(archive_path.read_bytes()).hexdigest()
    (output / 'site.sha256').write_text(digest + '  site.tar.gz\n', encoding='ascii')
    print(f'Packaged {len(files)} files from {commit}: {digest}')

if __name__ == '__main__':
    package(os.environ.get('RELEASE_COMMIT') or subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip())
