<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class WorkspaceAccess
{
    public function handle(Request $r, Closure $next): Response
    {
        abort_unless($r->user()?->active, 403, 'Konto jest nieaktywne.');
        if ((int) $r->session()->get(User::PLANNER_ACCESS_SESSION, 0) !== (int) $r->user()->planner_access_version) {
            Auth::guard('web')->logoutCurrentDevice();
            $r->session()->invalidate();
            $r->session()->regenerateToken();
            if ($r->is('api') || $r->expectsJson()) {
                abort(401, 'Zaloguj się ponownie.');
            }

            return redirect()->guest(route('filament.admin.auth.login'));
        }

        if ($r->is('api') && ! $r->isMethodSafe()) {
            abort_unless(is_string($r->header('X-CSRF-Token')) && hash_equals($r->session()->token(), $r->header('X-CSRF-Token')), 419, 'Sesja wygasła.');
        }

        return $next($r);
    }
}
