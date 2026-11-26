<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\User;
use App\Support\BackofficeConfirmation;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class BackofficePasswordTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_must_log_in_before_confirming_backoffice_access(): void
    {
        $this->get('/admin')->assertRedirect('/admin/login');
        $this->get(route('backoffice.password'))->assertRedirect('/admin/login');
        $this->post(route('backoffice.password.confirm'), ['password' => 'password'])->assertRedirect('/admin/login');
    }

    public function test_planner_login_does_not_confirm_backoffice_access_or_interrupt_the_editor(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        Auth::login($user);

        $this->get('/admin/users')->assertRedirect(route('backoffice.password'));
        $this->get('/admin/projects')->assertRedirect(route('backoffice.password'));
        $this->get(route('backoffice.password'))->assertOk()->assertSee('Potwierdź dostęp')
            ->assertSee('type="password"', false)->assertSee('3 dni');
        $this->get('/editor')->assertOk();
        $this->getJson('/api?api=session')->assertOk();
        $this->assertAuthenticatedAs($user);
    }

    public function test_confirmation_returns_to_the_requested_panel_page_and_sets_a_protected_three_day_cookie(): void
    {
        $this->freezeTime();
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->actingAs($user)->get('/admin/users')->assertRedirect(route('backoffice.password'));

        $response = $this->post(secure_url('/admin/confirm-password'), ['password' => 'password']);

        $response->assertRedirect('/admin/users')->assertSessionMissing(BackofficeConfirmation::INTENDED);
        $cookie = $response->getCookie(BackofficeConfirmation::COOKIE);
        $this->assertSame(now()->addDays(3)->timestamp, $cookie->getExpiresTime());
        $this->assertTrue($cookie->isSecure());
        $this->assertTrue($cookie->isHttpOnly());
        $this->assertSame('lax', $cookie->getSameSite());
        $this->assertNull($cookie->getDomain());
        $this->assertSame('/', $cookie->getPath());
        $this->assertNotSame($cookie->getValue(), $response->getCookie(BackofficeConfirmation::COOKIE, false)->getValue());
        $this->withCookie(BackofficeConfirmation::COOKIE, $cookie->getValue())->get('/admin/users')->assertOk();
    }

    public function test_confirmation_expires_at_72_hours_and_visits_do_not_extend_it(): void
    {
        $this->freezeTime();
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->confirmBackoffice($user);

        $this->travel(2)->days();
        $this->get('/admin/users')->assertOk()->assertCookieMissing(BackofficeConfirmation::COOKIE);
        $this->travel(23)->hours();
        $this->travel(59)->minutes();
        $this->travel(59)->seconds();
        $this->get('/admin/users')->assertOk();
        $this->travel(1)->seconds();
        $this->get('/admin/users')->assertRedirect(route('backoffice.password'));
        $this->get('/editor')->assertOk();
    }

    public function test_an_already_open_planner_can_save_after_confirming_backoffice_access(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $token = $this->actingAs($user)->getJson('/api?api=session')->assertOk()->json('csrf');
        $project = json_decode(file_get_contents(__DIR__.'/../Fixtures/project.json'), true);
        $project['id'] = (string) Str::uuid();

        $this->confirmBackoffice($user);

        $this->withCredentials()->putJson('/api?api=save', $project, ['X-CSRF-Token' => $token])->assertOk();
        $this->assertDatabaseHas('projects', ['id' => $project['id'], 'owner_id' => $user->id]);
    }

    public function test_a_new_planner_session_in_the_same_browser_keeps_the_unexpired_confirmation(): void
    {
        $this->freezeTime();
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->confirmBackoffice($user);
        session()->invalidate();
        Auth::forgetGuards();
        Auth::login($user);

        $this->get('/admin/users')->assertOk();
    }

    #[TestWith([null, 'Wpisz hasło do swojego konta.'])]
    #[TestWith(['wrong-password', 'Nieprawidłowe hasło. Spróbuj ponownie.'])]
    public function test_invalid_password_never_unlocks_the_panel_or_flashes_the_secret(?string $password, string $message): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);

        $this->actingAs($user)->from(route('backoffice.password'))
            ->post(route('backoffice.password.confirm'), ['password' => $password])
            ->assertRedirect(route('backoffice.password'))->assertSessionHasErrors(['password' => $message])
            ->assertSessionMissing('_old_input.password')->assertCookieMissing(BackofficeConfirmation::COOKIE);
        $this->get('/admin')->assertRedirect(route('backoffice.password'));
    }

    public function test_repeated_wrong_passwords_are_rate_limited_before_a_later_success(): void
    {
        $this->freezeTime();
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->actingAs($user);
        for ($i = 0; $i < 5; $i++) {
            $this->post(route('backoffice.password.confirm'), ['password' => 'wrong-password'])->assertSessionHasErrors('password');
        }

        $this->post(route('backoffice.password.confirm'), ['password' => 'password'])
            ->assertSessionHasErrors(['password' => 'Zbyt wiele prób. Spróbuj ponownie za 60 s.'])
            ->assertCookieMissing(BackofficeConfirmation::COOKIE);
        $this->travel(61)->seconds();
        $this->confirmBackoffice($user)->get('/admin/users')->assertOk();
    }

    public function test_confirmation_cannot_be_reused_by_another_account(): void
    {
        $first = User::factory()->create(['role' => 'admin', 'active' => true]);
        $second = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->confirmBackoffice($first);

        $this->actingAs($second)->get('/admin/users')->assertRedirect(route('backoffice.password'));
    }

    #[TestWith(['password'])]
    #[TestWith(['planner_access_version'])]
    public function test_password_or_access_changes_invalidate_an_old_confirmation_even_after_logging_in_again(string $field): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->confirmBackoffice($user);
        $user->forceFill([$field => $field === 'password' ? 'changed-password' : 1])->save();
        session()->invalidate();
        Auth::forgetGuards();
        Auth::login($user->fresh());

        $this->get('/admin/users')->assertRedirect(route('backoffice.password'));
    }

    public function test_logout_clears_the_browser_confirmation(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->confirmBackoffice($user);

        $this->post('/admin/logout')->assertCookieExpired(BackofficeConfirmation::COOKIE);
        $this->assertGuest();
    }

    public function test_a_tampered_cookie_cannot_unlock_backoffice(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->confirmBackoffice($user);

        $this->withUnencryptedCookie(BackofficeConfirmation::COOKIE, '{"confirmed_at":9999999999,"account":"forged"}')
            ->get('/admin/users')->assertRedirect(route('backoffice.password'));
    }

    public function test_logout_remains_available_without_a_backoffice_confirmation(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);

        $this->actingAs($user)->post('/admin/logout')->assertRedirect('/admin/login')
            ->assertCookieExpired(BackofficeConfirmation::COOKIE);
        $this->assertGuest();
    }

    public function test_confirmation_does_not_grant_admin_permissions_and_blocked_accounts_cannot_confirm(): void
    {
        $member = User::factory()->create(['role' => 'member', 'active' => true]);
        $this->confirmBackoffice($member)->get('/admin/users')->assertForbidden();
        $member->update(['active' => false]);

        $this->actingAs($member->fresh())->post(route('backoffice.password.confirm'), ['password' => 'password'])->assertForbidden();
    }

    public function test_private_inquiry_pages_and_attachments_also_require_confirmation(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $inquiry = Inquiry::create(['reference' => 'IS-TEST', 'kind' => 'project', 'payload' => ['name' => 'Private inquiry'], 'files' => []]);

        $this->actingAs($user)->get(route('inquiries.show', $inquiry))->assertRedirect(route('backoffice.password'));
        $this->get(route('inquiries.download', [$inquiry, 0]))->assertRedirect(route('backoffice.password'));
    }

    #[TestWith([0, 200])]
    #[TestWith([72, 302])]
    public function test_livewire_panel_updates_require_an_unexpired_confirmation(int $elapsedHours, int $expectedStatus): void
    {
        $this->freezeTime();
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $page = $this->confirmBackoffice($user)->get('/admin/users')->assertOk();
        preg_match_all('/wire:snapshot="([^"]+)"/', $page->getContent(), $matches);
        $snapshot = collect($matches[1])->map(fn (string $value): string => html_entity_decode($value, ENT_QUOTES))
            ->first(fn (string $value): bool => (json_decode($value, true)['memo']['path'] ?? null) === 'admin/users');
        $this->assertNotNull($snapshot);
        $payload = ['components' => [[
            'snapshot' => $snapshot, 'updates' => [], 'calls' => [['path' => '', 'method' => '$refresh', 'params' => []]],
        ]]];
        $this->travel($elapsedHours)->hours();

        $this->withCredentials()->postJson(Livewire::getUpdateUri(), $payload, ['X-Livewire' => 'true'])->assertStatus($expectedStatus);
    }

    public function test_confirmation_ignores_an_external_return_address(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);

        $this->actingAs($user)->withSession([BackofficeConfirmation::INTENDED => 'https://example.test/phishing'])
            ->post(route('backoffice.password.confirm'), ['password' => 'password'])
            ->assertRedirect(route('filament.admin.pages.dashboard'));
    }

    public function test_confirmation_requires_csrf_protection(): void
    {
        $user = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->app->instance('env', 'production');

        $this->actingAs($user)->post(route('backoffice.password.confirm'), ['password' => 'password'])
            ->assertStatus(419)->assertCookieMissing(BackofficeConfirmation::COOKIE);
    }
}
