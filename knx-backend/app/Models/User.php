<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Auth\MultiFactor\App\Concerns\InteractsWithAppAuthentication;
use Filament\Auth\MultiFactor\App\Concerns\InteractsWithAppAuthenticationRecovery;
use Filament\Auth\MultiFactor\App\Contracts\HasAppAuthentication;
use Filament\Auth\MultiFactor\App\Contracts\HasAppAuthenticationRecovery;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

#[Fillable(['name', 'email', 'password', 'role', 'active'])]
#[Hidden(['password', 'remember_token', 'app_authentication_secret', 'app_authentication_recovery_codes'])]
class User extends Authenticatable implements FilamentUser, HasAppAuthentication, HasAppAuthenticationRecovery
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, InteractsWithAppAuthentication, InteractsWithAppAuthenticationRecovery, Notifiable;

    public const PLANNER_ACCESS_SESSION = 'knx.planner_access_version';

    public function canAccessPanel(Panel $panel): bool
    {
        return $this->active;
    }

    public function isAdmin(): bool
    {
        return $this->active && $this->role === 'admin';
    }

    public function setPlannerAccess(User $administrator, bool $grant): void
    {
        DB::transaction(function () use ($administrator, $grant): void {
            $accounts = self::query()->whereKey([$administrator->getKey(), $this->getKey()])
                ->orderBy('id')->lockForUpdate()->get();
            $account = $accounts->findOrFail($this->getKey());
            Gate::forUser($accounts->findOrFail($administrator->getKey()))->authorize('managePlannerAccess', $account);
            if ($account->active === $grant) {
                return;
            }

            $account->active = $grant;
            $account->planner_access_version++;
            $account->setRememberToken(Str::random(60));
            $account->save();
        });
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'active' => 'boolean',
            'planner_access_version' => 'integer',
        ];
    }
}
