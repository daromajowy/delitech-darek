import copy
import importlib.util
from pathlib import Path
import unittest
from unittest.mock import patch


def load(name, file):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).resolve().parents[1] / 'scripts' / file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


controller = load('paired_deploy', 'cf-deploy-release.py')
promotion = load('promotion', 'prepare-promotion.py')
SHA = 'a' * 40
HASHES = {'site': 'b' * 64, 'knx': 'c' * 64}


def config(environment):
    return {**controller.site.TARGETS[environment], 'environment': environment, 'application': 'static-laravel',
            'repository': 'daromajowy/delitech-darek', 'branch': 'main'}


def deployment():
    return {'id': 123, 'sha': SHA, 'environment': 'production', 'task': 'intelispaces-promote', 'production_environment': True,
            'creator': {'login': 'github-actions[bot]'},
            'payload': {'schema': 1, 'source': 'staging', 'workflow': 'promote.yml', 'commit': SHA, 'archives': HASHES.copy()}}


class PromotionGateTests(unittest.TestCase):
    def test_main_changes_alone_never_authorize_production(self):
        with patch.object(controller.site, 'read_json', return_value=[]) as get:
            self.assertIsNone(controller.desired_release(config('production')))
        self.assertEqual(len(get.call_args_list), 1)
        self.assertIn('/deployments?environment=production&task=intelispaces-promote', get.call_args.args[0])
        self.assertNotIn('/heads/main', get.call_args.args[0])

    def test_staging_follows_main_without_production_permission(self):
        with patch.object(controller.site, 'read_json', return_value={'object': {'sha': SHA}}) as get:
            self.assertEqual(controller.desired_release(config('staging')), {'commit': SHA, 'request_id': None, 'archives': None})
        self.assertTrue(get.call_args.args[0].endswith('/git/ref/heads/main'))

    def test_valid_promotion_pins_both_archive_hashes_and_commit(self):
        with patch.object(controller.site, 'read_json', return_value=[deployment()]):
            self.assertEqual(controller.desired_release(config('production')), {'commit': SHA, 'request_id': 123, 'archives': HASHES})

    def test_failed_cancelled_or_not_started_approvals_do_not_deploy(self):
        for statuses in [[], [{'state': 'error'}], [{'state': 'failure'}], [{'state': 'inactive'}]]:
            with self.subTest(statuses=statuses), patch.object(controller.site, 'read_json', return_value=statuses):
                self.assertFalse(controller.promotion_is_active(controller.validate_promotion(deployment())))

    def test_rejects_unverified_or_mismatched_promotion_records(self):
        for change in [{'sha': 'd' * 40}, {'task': 'deploy'}, {'environment': 'staging'}, {'production_environment': False},
                       {'creator': {'login': 'some-user'}}, {'id': -1}, {'payload': {}},
                       {'payload': {**deployment()['payload'], 'source': 'main'}},
                       {'payload': {**deployment()['payload'], 'archives': {'site': 'b' * 64}}},
                       {'payload': {**deployment()['payload'], 'archives': {'site': 'wrong', 'knx': 'c' * 64}}}]:
            with self.subTest(change=change), self.assertRaises(ValueError):
                controller.validate_promotion({**deployment(), **change})


class PreparePromotionTests(unittest.TestCase):
    def setUp(self):
        self.markers = {
            promotion.STAGING[0]: {'kind': 'static', 'environment': 'staging', 'commit': SHA, 'archive_sha256': HASHES['site']},
            promotion.STAGING[1]: {'kind': 'knx', 'environment': 'staging', 'commit': SHA, 'archive_sha256': HASHES['knx']},
        }
        self.paired = {'status': 'ready', 'environment': 'staging', 'commit': SHA, 'archives': HASHES.copy()}
        self.comparison = 'identical'
        self.reads = 0
        self.change_during_check = False

    def read(self, url):
        for origin in promotion.STAGING:
            if url.startswith(origin + '/release.json'):
                self.reads += 1
                marker = copy.deepcopy(self.markers[origin])
                if self.change_during_check and self.reads > 2:
                    marker['commit'] = 'd' * 40
                return marker
            if url.startswith(origin + '/deployment.json'):
                return copy.deepcopy(self.paired)
        if '/compare/' in url:
            return {'status': self.comparison}
        if '/releases/tags/' in url:
            return {'tag_name': 'cf-' + SHA, 'draft': False, 'assets': [{'name': name + suffix} for name in ['site', 'knx'] for suffix in ['.tar.gz', '.sha256']]}
        raise AssertionError('Unexpected URL: ' + url)

    def checksum(self, url):
        return (HASHES['site' if url.endswith('site.sha256') else 'knx'] + ' archive.tar.gz').encode()

    def prepare(self, version=SHA[:12]):
        with patch.object(promotion, 'read_json', side_effect=self.read), patch.object(promotion, 'fetch', side_effect=self.checksum):
            return promotion.prepare(version)

    def test_explicit_tested_version_produces_request_without_merging(self):
        result = self.prepare()
        self.assertEqual(result['ref'], SHA)
        self.assertEqual(result['payload']['archives'], HASHES)
        self.assertFalse(result['auto_merge'])
        self.assertEqual(result['environment'], 'production')

    def test_wrong_or_empty_version_is_never_replaced_with_latest_main(self):
        for value in ['', 'main', 'latest', 'd' * 12, 'a' * 6, 'a' * 41, '$(echo unsafe)']:
            with self.subTest(value=value), self.assertRaises(ValueError):
                self.prepare(value)

    def test_mixed_incomplete_or_production_markers_are_rejected(self):
        original = copy.deepcopy(self.markers)
        for change in [{'commit': 'd' * 40}, {'environment': 'production'}, {'archive_sha256': ''}, {'kind': 'static'}]:
            self.markers = copy.deepcopy(original)
            self.markers[promotion.STAGING[1]].update(change)
            with self.subTest(change=change), self.assertRaises(ValueError):
                self.prepare()
        self.markers = original
        self.paired['status'] = 'deploying'
        with self.assertRaises(ValueError):
            self.prepare()

    def test_archive_replaced_after_staging_is_rejected(self):
        with patch.object(promotion, 'read_json', side_effect=self.read), patch.object(promotion, 'fetch', return_value=('e' * 64).encode()):
            with self.assertRaises(ValueError):
                promotion.prepare(SHA)

    def test_staging_advance_during_approval_is_rejected(self):
        self.change_during_check = True
        with self.assertRaises(ValueError):
            self.prepare()

    def test_release_outside_main_history_is_rejected(self):
        self.comparison = 'diverged'
        with self.assertRaises(ValueError):
            self.prepare()


if __name__ == '__main__':
    unittest.main()
