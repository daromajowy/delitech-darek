<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeploymentEnvironmentTest extends TestCase
{
    use RefreshDatabase;

    public function test_staging_forms_only_accept_the_staging_website(): void
    {
        $priorEnv = $_ENV['APP_ENV'] ?? null;
        $priorServer = $_SERVER['APP_ENV'] ?? null;
        $_ENV['APP_ENV'] = $_SERVER['APP_ENV'] = 'staging';
        try {
            $cors = require config_path('cors.php');
        } finally {
            $_ENV['APP_ENV'] = $priorEnv;
            $_SERVER['APP_ENV'] = $priorServer;
        }
        $this->assertSame(['https://staging.intelispaces.pl'], $cors['allowed_origins']);
        config(['cors' => $cors]);
        $payload = ['payload' => json_encode(['kind' => 'consultation', 'name' => 'Test staging', 'email' => 'test@example.com',
            'phone' => '505260715', 'consentDataProcessing' => true])];
        $this->post('/api/inquiries', $payload, ['Accept' => 'application/json', 'Origin' => 'https://intelispaces.pl'])->assertForbidden();
        $this->assertDatabaseCount('inquiries', 0);
        $this->post('/api/inquiries', $payload, ['Accept' => 'application/json', 'Origin' => 'https://staging.intelispaces.pl'])->assertCreated();
        $this->assertDatabaseCount('inquiries', 1);
        $this->options('/api/inquiries', [], ['Origin' => 'https://staging.intelispaces.pl', 'Access-Control-Request-Method' => 'POST'])
            ->assertHeader('Access-Control-Allow-Origin', 'https://staging.intelispaces.pl');
    }

    public function test_environment_label_is_visible_on_staging_and_absent_on_production(): void
    {
        $this->app->instance('env', 'staging');
        $this->get('/admin/login')->assertOk()->assertSee('InteliSpaces Staging')->assertSee('data-staging-banner', false);
        $this->assertStringContainsString('e-maile wyłączone', view('staging-banner')->render());
        $this->app->instance('env', 'production');
        $this->assertSame('', trim(view('staging-banner')->render()));
    }

    public function test_backup_refuses_a_database_belonging_to_the_other_environment(): void
    {
        $previous = ['app.env' => config('app.env'), 'database.default' => config('database.default'),
            'database.connections.mysql.database' => config('database.connections.mysql.database')];
        try {
            foreach ([['production', 'horcwnciix_knxstage'], ['staging', 'horcwnciix_knx'], ['testing', 'horcwnciix_knx'], ['staging', 'another_database']] as [$environment, $database]) {
                config(['app.env' => $environment, 'database.default' => 'mysql', 'database.connections.mysql.database' => $database]);
                $this->artisan('knx:backup-database', ['directory' => sys_get_temp_dir()])
                    ->expectsOutput('Unexpected database; refusing export.')
                    ->assertExitCode(1);
            }
        } finally {
            config($previous);
        }
    }
}
