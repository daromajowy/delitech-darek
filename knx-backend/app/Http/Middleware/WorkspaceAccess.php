<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class WorkspaceAccess
{
    public function handle(Request $r, Closure $next)
    {
        abort_unless($r->user()?->active, 403, 'Konto jest nieaktywne.');
        if ($r->is('api') && ! $r->isMethodSafe()) {
            abort_unless(is_string($r->header('X-CSRF-Token')) && hash_equals($r->session()->token(), $r->header('X-CSRF-Token')), 419, 'Sesja wygasła.');
        }

        return $next($r);
    }
}
