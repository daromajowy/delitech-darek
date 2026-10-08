<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class BackupWorkspace extends Command
{
    protected $signature = 'knx:backup-database {directory}';

    protected $description = 'Export the KNX database to a private, existing backup directory';

    public function handle(): int
    {
        $directory = realpath($this->argument('directory'));
        if (! $directory || ! is_writable($directory) || str_contains($directory, '/public_html/')) {
            $this->error('Backup directory must be writable and outside public_html.');

            return self::FAILURE;
        }
        $connection = config('database.connections.'.config('database.default'));
        $expectedDatabase = match (config('app.env')) {
            'production' => 'horcwnciix_knx',
            'staging' => 'horcwnciix_knxstage',
            default => null,
        };
        if ($expectedDatabase === null || $connection['driver'] !== 'mysql' || $connection['database'] !== $expectedDatabase) {
            $this->error('Unexpected database; refusing export.');

            return self::FAILURE;
        }
        $dump = $directory.'/database.sql';
        if (file_exists($dump)) {
            $this->error('Backup already exists.');

            return self::FAILURE;
        }
        $defaults = tempnam($directory, '.mysql-');
        chmod($defaults, 0600);
        $quote = fn (mixed $value): string => '"'.str_replace(['\\', '"', "\n", "\r"], ['\\\\', '\\"', '\\n', '\\r'], (string) $value).'"';
        $settings = "[client]\n";
        foreach (['host' => 'host', 'port' => 'port', 'username' => 'user', 'password' => 'password'] as $key => $option) {
            $settings .= $option.'='.$quote($connection[$key])."\n";
        }
        file_put_contents($defaults, $settings);
        try {
            // CF's /usr/bin wrapper prepends options; defaults-extra-file must be first.
            $process = proc_open(['/usr/local/mariadb1011/bin/mariadb-dump', '--defaults-extra-file='.$defaults, '--single-transaction', '--quick', '--skip-lock-tables', $connection['database']],
                [0 => ['file', '/dev/null', 'r'], 1 => ['file', $dump, 'w'], 2 => ['file', $directory.'/dump-error.log', 'w']], $pipes);
            if (! is_resource($process) || proc_close($process) !== 0) {
                throw new \RuntimeException('Database backup failed.');
            }
            chmod($dump, 0600);
            $handle = fopen($dump, 'rb');
            fseek($handle, max(0, filesize($dump) - 2048));
            $tail = stream_get_contents($handle);
            fclose($handle);
            if (! str_contains($tail, 'Dump completed on') || filesize($dump) < 1000) {
                throw new \RuntimeException('Database export is incomplete.');
            }
            $this->info('DATABASE_BACKUP_OK');

            return self::SUCCESS;
        } finally {
            unlink($defaults);
        }
    }
}
