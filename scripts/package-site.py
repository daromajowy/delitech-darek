"""Package only the generated public website, with a per-file integrity manifest."""
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile

ROOT = Path(__file__).resolve().parent.parent


def package(commit):
    if not re.fullmatch(r'[a-f0-9]{40}', commit):
        raise ValueError('Expected full commit SHA')
    files = {}
    for path in sorted((ROOT / 'dist').rglob('*')):
        name = path.relative_to(ROOT / 'dist').as_posix()
        if path.is_symlink():
            raise ValueError('Symlink in website build')
        if not path.is_file() or name.startswith('.vite/'):
            continue
        files[name] = hashlib.sha256(path.read_bytes()).hexdigest()
    manifest = json.dumps({'schema': 2, 'kind': 'static', 'commit': commit, 'files': files}, separators=(',', ':')).encode()
    target = ROOT / 'build'
    target.mkdir(exist_ok=True)
    with tarfile.open(target / 'site.tar.gz', 'w:gz') as archive:
        for name in files:
            archive.add(ROOT / 'dist' / name, arcname=name, recursive=False)
        info = tarfile.TarInfo('release.json')
        info.size, info.mode = len(manifest), 0o644
        archive.addfile(info, io.BytesIO(manifest))
    digest = hashlib.sha256((target / 'site.tar.gz').read_bytes()).hexdigest()
    (target / 'site.sha256').write_text(digest + '  site.tar.gz\n')
    import importlib.util
    spec = importlib.util.spec_from_file_location('static_deploy', ROOT / 'scripts/cf-deploy-static.py')
    deploy = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(deploy)
    deploy.validate_archive(target / 'site.tar.gz', commit)
    print(f'Packaged {len(files)} public files: {commit}')


if __name__ == '__main__':
    package(os.environ.get('RELEASE_COMMIT') or subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip())
