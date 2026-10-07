<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class BootstrapAdmin extends Command
{
    protected $signature = 'knx:bootstrap-admin {email} {--name=Administrator InteliSpaces}';

    protected $description = 'Create the first administrator; save credentials privately, never to stdout.';

    public function handle(): int
    {
        if (User::where('role', 'admin')->exists()) {
            $this->info('Administrator already exists; unchanged.');

            return self::SUCCESS;
        }
        $email = strtolower($this->argument('email'));
        if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return self::FAILURE;
        }
        $password = Str::password(28);
        User::create(['name' => $this->option('name'), 'email' => $email, 'password' => $password, 'role' => 'admin', 'active' => true]);
        $file = storage_path('app/private/initial-admin.json');
        file_put_contents($file, json_encode(['url' => config('app.url').'/admin', 'email' => $email, 'password' => $password], JSON_PRETTY_PRINT));
        chmod($file, 0600);
        $this->info('Administrator created. Credentials saved to private initial-admin.json.');

        return self::SUCCESS;
    }
}
