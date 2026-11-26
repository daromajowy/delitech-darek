<?php

namespace App\Http\Middleware;

use App\Support\BackofficeConfirmation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RequireBackofficePassword
{
    public function __construct(private BackofficeConfirmation $confirmation) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->routeIs('filament.admin.auth.logout') && ! $this->confirmation->isValid($request)) {
            if ($request->isMethod('GET') && ! $request->hasHeader('X-Livewire')) {
                $request->session()->put(BackofficeConfirmation::INTENDED, $request->getRequestUri());
            }

            return redirect()->route('backoffice.password');
        }

        return $next($request);
    }
}
