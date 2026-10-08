import copy
import importlib.util
from pathlib import Path
import unittest

spec = importlib.util.spec_from_file_location('archive_backups', Path(__file__).resolve().parents[1] / 'scripts/archive-backups.py')
archive = importlib.util.module_from_spec(spec)
spec.loader.exec_module(archive)


class ArchiveBackupsTest(unittest.TestCase):
    def setUp(self):
        self.sha = 'a' * 40
        self.plan = {'repository': 'daromajowy/delitech-darek', 'backups': [
            {'branch': 'backup/example', 'tag': 'archive/backup/example', 'sha': self.sha}], 'snapshots': []}

    def test_create_tag_and_remove_only_expected_backup(self):
        self.assertEqual(archive.operations(self.plan, {'refs/heads/backup/example': self.sha}),
                         ([('refs/tags/archive/backup/example', self.sha)], [('refs/heads/backup/example', self.sha)]))

    def test_moved_branch_or_mismatched_archive_stops_everything(self):
        for refs in [{'refs/heads/backup/example': 'b' * 40}, {'refs/tags/archive/backup/example': 'b' * 40}]:
            with self.assertRaises(ValueError):
                archive.operations(self.plan, refs)

    def test_active_branch_cannot_be_deleted(self):
        for branch in ['main', 'Janka', 'Darka', 'codex/knx-laravel']:
            plan = copy.deepcopy(self.plan)
            plan['backups'][0]['branch'] = branch
            with self.assertRaises(ValueError):
                archive.operations(plan, {})

    def test_completed_archive_is_idempotent(self):
        self.assertEqual(archive.operations(self.plan, {'refs/tags/archive/backup/example': self.sha}), ([], []))
