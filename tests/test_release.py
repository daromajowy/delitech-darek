import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import MagicMock, patch

spec = importlib.util.spec_from_file_location('deploy', Path(__file__).resolve().parents[1] / 'scripts/cf-deploy.py')
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)
SHA = 'a' * 40

class DeploymentTargetTests(unittest.TestCase):
    def config(self, environment):
        root, url = deploy.TARGETS[environment]
        return {'root': root, 'url': url, 'environment': environment}

    def test_production_requires_exact_domain_and_root(self):
        config = self.config('production')
        self.assertEqual(deploy.deployment_target(config)[1], 'production')
        for changed in ({'root': '/home/another-account/public_html'},
                        {'url': 'https://other.example/'}, {'environment': 'staging'}):
            with self.subTest(changed=changed), self.assertRaises(ValueError):
                deploy.deployment_target({**config, **changed})

    def test_existing_staging_config_remains_private(self):
        config = self.config('staging')
        del config['environment']
        self.assertEqual(deploy.deployment_target(config)[1], 'staging')
        response = MagicMock(status=200, url=config['url'])
        response.read.return_value = b'<div id="root">__INTELISPACES__</div>'
        with patch.object(deploy.urllib.request, 'urlopen') as request:
            request.return_value.__enter__.return_value = response
            with self.assertRaises(ValueError):
                deploy.verify_http_health(config)

    def test_production_rejects_login_redirect_and_empty_page(self):
        config = self.config('production')
        for url, body in [(config['url']+'wp-login.php', b'user_login'),
                          (config['url'], b'Hosting placeholder')]:
            response = MagicMock(status=200, url=url)
            response.read.return_value = body
            with patch.object(deploy.urllib.request, 'urlopen') as request:
                request.return_value.__enter__.return_value = response
                with self.assertRaises(ValueError):
                    deploy.verify_http_health(config)

    def test_production_accepts_our_public_site(self):
        config = self.config('production')
        response = MagicMock(status=200, url=config['url'])
        response.read.return_value = b'<div id="root"></div><script>__INTELISPACES__ = {}</script>'
        with patch.object(deploy.urllib.request, 'urlopen') as request:
            request.return_value.__enter__.return_value = response
            deploy.verify_http_health(config)

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
