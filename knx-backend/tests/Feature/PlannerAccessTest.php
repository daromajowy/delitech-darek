<?php

namespace Tests\Feature;

use App\Filament\Auth\PlannerLogin;
use App\Filament\Resources\UserResource\Pages\CreateUser;
use App\Filament\Resources\UserResource\Pages\ListUsers;
use App\Models\Project;
use App\Models\User;
use Filament\Facades\Filament;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\TestWith;
use Tests\TestCase;

class PlannerAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_legacy_entry_points_preserve_the_project_and_lead_guests_to_the_password_form(): void
    {
        $id = (string) Str::uuid();
        foreach (['/planner/', '/planner/index.html'] as $old) {
            $this->get($old.'?project='.$id)->assertRedirect(route('planner', ['project' => $id]));
        }
        $this->get(route('planner', ['project' => $id]))->assertRedirect('/admin/login');
        $this->get('/admin/users')->assertRedirect('/admin/login');
        $this->get('/admin/login')->assertOk()->assertSee('Logowanie do Projektanta KNX')
            ->assertSee('type="password"', false)->assertDontSee('/admin/register');
    }

    public function test_admin_can_create_a_designer_then_block_and_restore_access_without_losing_the_project(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->actingAs($admin)->get('/admin/users')->assertOk()->assertSee('Dostęp do Projektanta KNX');
        Livewire::test(CreateUser::class)
            ->fillForm(['name' => 'Projektant testowy', 'email' => 'architekt@example.test', 'password' => 'TestoweHaslo493!', 'role' => 'member', 'active' => true])
            ->call('create')->assertHasNoFormErrors();
        $designer = User::where('email', 'architekt@example.test')->firstOrFail();
        $project = Project::create(['id' => (string) Str::uuid(), 'owner_id' => $designer->id, 'name' => 'Przykładowy dom', 'payload' => []]);
        $this->assertTrue($designer->active);

        Livewire::test(ListUsers::class)->callTableAction('blockAccess', $designer);
        $this->assertFalse($designer->fresh()->active);
        Livewire::test(ListUsers::class)->callTableAction('grantAccess', $designer->fresh());
        $this->assertTrue($designer->fresh()->active);
        $this->assertModelExists($project);
    }

    #[TestWith([true, 'BledneHaslo1234'])]
    #[TestWith([false, 'TestoweHaslo493!'])]
    public function test_wrong_credentials_or_a_blocked_account_cannot_start_a_session(bool $active, string $password): void
    {
        $user = User::factory()->create(['active' => $active, 'password' => 'TestoweHaslo493!']);
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Livewire::test(PlannerLogin::class)->fillForm(['email' => $user->email, 'password' => $password])
            ->call('authenticate')->assertHasErrors(['data.email']);
        $this->assertGuest();
    }

    public function test_restoring_access_requires_a_fresh_login_even_if_the_browser_did_not_visit_while_blocked(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'active' => true]);
        $user = User::factory()->create(['active' => true, 'password' => 'TestoweHaslo493!']);
        $oldRememberToken = $user->getRememberToken();
        $this->actingAs($user)->getJson('/api?api=session')->assertOk();
        $user->setPlannerAccess($admin, false);
        $user->setPlannerAccess($admin, true);
        $this->assertNotSame($oldRememberToken, $user->fresh()->getRememberToken());
        $this->actingAs($user->fresh())->getJson('/api?api=session')->assertUnauthorized();
        $this->assertGuest();
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        Livewire::test(PlannerLogin::class)->fillForm(['email' => $user->email, 'password' => 'TestoweHaslo493!'])
            ->call('authenticate')->assertHasNoFormErrors();
        $this->assertAuthenticatedAs($user);
        $this->assertSame($user->fresh()->planner_access_version, session(User::PLANNER_ACCESS_SESSION));
        $sessionId = session()->getId();
        session()->save();
        $this->withCookie(config('session.cookie'), $sessionId)->withCredentials()->getJson('/api?api=session')->assertOk();
        $this->get('/admin/users')->assertForbidden();
    }

    public function test_an_admin_cannot_block_their_own_account(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'active' => true]);
        $this->expectException(AuthorizationException::class);
        $admin->setPlannerAccess($admin, false);
    }

    public function test_a_designer_cannot_change_another_accounts_access(): void
    {
        $designer = User::factory()->create(['role' => 'member', 'active' => true]);
        $other = User::factory()->create(['active' => true]);
        $this->expectException(AuthorizationException::class);
        $other->setPlannerAccess($designer, false);
    }
}
