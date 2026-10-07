import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('knx_deploy', Path(__file__).resolve().parents[1] / 'scripts/cf-deploy-knx.py')
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)
COMMIT = 'a' * 40


class KnxReleaseTest(unittest.TestCase):
    def archive(self, directory, extra=None, wrong_hash=False, symlink=False):
        files = {name: b'fixture' for name in deploy.REQUIRED}
        if extra:
            files[extra] = b'unsafe'
        hashes = {name: hashlib.sha256(content).hexdigest() for name, content in files.items()}
        if wrong_hash:
            hashes['artisan'] = '0' * 64
        files['knx-release.json'] = json.dumps({'schema': 1, 'kind': 'knx', 'commit': COMMIT, 'files': hashes}).encode()
        path = Path(directory) / 'knx.tar.gz'
        with tarfile.open(path, 'w:gz') as archive:
            for name, data in files.items():
                member = tarfile.TarInfo(name)
                member.size = len(data)
                if symlink and name == 'artisan':
                    member.type, member.linkname = tarfile.SYMTYPE, '/etc/passwd'
                    archive.addfile(member)
                else:
                    archive.addfile(member, io.BytesIO(data))
        return path

    def test_valid_release_is_accepted_and_unpack_preserves_content(self):
        with tempfile.TemporaryDirectory() as directory:
            archive = self.archive(directory)
            deploy.validate_archive(archive, COMMIT)
            target = Path(directory) / 'unpacked'
            deploy.common.unpack(archive, target)
            self.assertEqual(b'fixture', (target / 'artisan').read_bytes())

    def test_rejects_traversal_private_data_and_wrong_root(self):
        for name in ['../escape', '/absolute', 'app/../../escape', '.env', 'storage/app/document.pdf', 'public/storage/document.pdf', 'database/database.sqlite', 'bootstrap/cache/config.php']:
            with self.subTest(path=name), tempfile.TemporaryDirectory() as directory:
                with self.assertRaises(ValueError):
                    deploy.validate_archive(self.archive(directory, extra=name), COMMIT)

    def test_rejects_hash_mismatch_wrong_commit_and_symlinks(self):
        for options, commit in [({'wrong_hash': True}, COMMIT), ({'symlink': True}, COMMIT), ({}, 'b' * 40)]:
            with self.subTest(options=options, commit=commit), tempfile.TemporaryDirectory() as directory:
                with self.assertRaises(ValueError):
                    deploy.validate_archive(self.archive(directory, **options), commit)


if __name__ == '__main__':
    unittest.main()
