import hashlib
import importlib.util
import io
import json
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import MagicMock, patch

spec = importlib.util.spec_from_file_location('deploy', Path(__file__).resolve().parents[1] / 'scripts/cf-deploy-static.py')
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)
SHA = 'a' * 40

class DeploymentTargetTests(unittest.TestCase):
    def config(self, environment):
        return {**deploy.TARGETS['production'], 'environment': environment,
                'application': 'static-laravel', 'repository': 'daromajowy/delitech-darek', 'branch': 'main'}

    def test_production_requires_exact_domain_and_root(self):
        config = self.config('production')
        self.assertEqual(deploy.deployment_target(config)[1], 'production')
        for changed in ({'root': '/home/another-account/public_html'},
                        {'url': 'https://other.example/'}, {'environment': 'staging'},
                        {'branch': 'Janka'}, {'repository': 'another/repository'}, {'application': 'wordpress'}):
            with self.subTest(changed=changed), self.assertRaises(ValueError):
                deploy.deployment_target({**config, **changed})

    def test_old_staging_config_is_not_a_deployment_target(self):
        config = self.config('staging')
        with self.assertRaises(ValueError):
            deploy.deployment_target(config)

    def test_staging_has_its_own_root_backend_and_trigger(self):
        config = {**self.config('staging'), **deploy.TARGETS['staging']}
        self.assertEqual(deploy.deployment_target(config)[1], 'staging')
        for key in ['root', 'url', 'knx_root', 'knx_url', 'trigger']:
            with self.subTest(key=key), self.assertRaises(ValueError):
                deploy.deployment_target({**config, key: deploy.TARGETS['production'][key]})

    def test_production_rejects_old_automatic_main_trigger(self):
        with self.assertRaises(ValueError):
            deploy.deployment_target({**self.config('production'), 'trigger': 'main'})

    def test_staging_rewrites_forms_and_links_without_changing_production_package(self):
        with tempfile.TemporaryDirectory() as directory:
            folder = Path(directory)
            html = '<head></head><body>https://knx.intelispaces.pl/api/inquiries https://intelispaces.pl/contact/</body>'
            (folder / 'index.html').write_text(html, encoding='utf-8')
            (folder / 'sitemap.xml').write_text('https://intelispaces.pl/contact/')
            (folder / '.htaccess').write_text('https://intelispaces.pl https://knx.intelispaces.pl intelispaces\\.pl')
            deploy.prepare_environment(folder, self.config('production'), SHA)
            self.assertEqual((folder / 'index.html').read_text(encoding='utf-8'), html)
            config = {**self.config('staging'), **deploy.TARGETS['staging']}
            deploy.prepare_environment(folder, config, SHA)
            result = (folder / 'index.html').read_text(encoding='utf-8')
            self.assertIn('https://knx-staging.intelispaces.pl/api/inquiries', result)
            self.assertIn('https://staging.intelispaces.pl/contact/', result)
            self.assertIn('data-staging-banner', result)
            self.assertIn('noindex,nofollow,noarchive', result)
            self.assertNotIn('https://knx.intelispaces.pl', result)
            self.assertEqual((folder / 'robots.txt').read_text(), 'User-agent: *\nDisallow: /\n')

    def test_production_rejects_login_redirect_and_empty_page(self):
        config = self.config('production')
        for url, body in [(config['url']+'wp-login.php', b'user_login'),
                          (config['url'], b'Hosting placeholder'),
                          (config['url'], b'<div id="root">__INTELISPACES__ /wp-content/</div>')]:
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
        manifest = {'schema': 2, 'kind': 'static', 'commit': commit, 'files': {name: hashlib.sha256(body).hexdigest() for name, body in files.items()}}
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
        link = tarfile.TarInfo('assets/link')
        link.type, link.linkname = tarfile.SYMTYPE, '/home/horcwnciix'
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(link), SHA)

    def test_rejects_wrong_commit(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(commit='b' * 40), SHA)

    def test_rejects_modified_file(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(change=lambda files, manifest: files.update({'index.html': b'modified'})), SHA)

    def test_rejects_database_dump(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(tarfile.TarInfo('assets/database.sql')), SHA)

    def test_rejects_duplicate_entry(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(tarfile.TarInfo('index.html')), SHA)

    def test_rejects_missing_runtime_file(self):
        with self.assertRaises(ValueError):
            deploy.validate_archive(self.archive(change=lambda files, manifest: files.pop('index.html')), SHA)

    def test_static_release_cannot_replace_knx_or_install_executable_files(self):
        for name in ['knx-app/.env', 'knx/app/artisan', 'knx/app/.env', 'assets/upload.php', 'media/.htaccess', 'assets/.env', 'assets\\escape']:
            with self.subTest(path=name), self.assertRaises(ValueError):
                deploy.validate_archive(self.archive(tarfile.TarInfo(name)), SHA)

    def test_static_deployment_never_replaces_knx_container(self):
        self.assertNotIn('knx', deploy.MANAGED)
        self.assertIn('knx/index.html', deploy.MANAGED)

if __name__ == '__main__':
    unittest.main()
