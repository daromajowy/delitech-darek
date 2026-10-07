import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('deploy', Path(__file__).resolve().parents[1] / 'scripts/cf-deploy.py')
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)
SHA = 'a' * 40

class ReleaseSafetyTests(unittest.TestCase):
    def archive(self, extra=None, change=None, commit=SHA):
        folder = tempfile.TemporaryDirectory()
        self.addCleanup(folder.cleanup)
        path = Path(folder.name) / 'site.tar.gz'
        files = {name: b'test-content' for name in deploy.REQUIRED}
        manifest = {'schema': 1, 'commit': commit, 'files': {name: hashlib.sha256(body).hexdigest() for name, body in files.items()}}
        if change:
            change(files, manifest)
        with tarfile.open(path, 'w:gz') as archive:
            for name, body in {**files, 'release.json': json.dumps(manifest).encode()}.items():
                info = tarfile.TarInfo(name)
                info.size = len(body)
                archive.addfile(info, io.BytesIO(body))
            if extra:
                archive.addfile(extra)
        return path

    def test_valid_complete_package(self):
        self.assertEqual(deploy.validate_archive(self.archive(), SHA)['commit'], SHA)

    def test_rejects_path_escape(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(tarfile.TarInfo('../wp-config.php')), SHA)

    def test_rejects_absolute_path(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(tarfile.TarInfo('/tmp/payload')), SHA)

    def test_rejects_symlink(self):
        link = tarfile.TarInfo('intelispaces/link')
        link.type, link.linkname = tarfile.SYMTYPE, '/home/horcwnciix'
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(link), SHA)

    def test_rejects_wrong_commit(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(commit='b' * 40), SHA)

    def test_rejects_modified_file(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(change=lambda files, manifest: files.update({'intelispaces/index.php': b'modified'})), SHA)

    def test_rejects_database_dump(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(tarfile.TarInfo('intelispaces/database.sql')), SHA)

    def test_rejects_duplicate_entry(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(tarfile.TarInfo('intelispaces/index.php')), SHA)

    def test_rejects_missing_runtime_file(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(change=lambda files, manifest: files.pop('intelispaces/index.php')), SHA)

if __name__ == '__main__':
    unittest.main()
