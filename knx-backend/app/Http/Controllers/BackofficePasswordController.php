<?php

namespace App\Http\Controllers;

use App\Support\BackofficeConfirmation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;

class BackofficePasswordController extends Controller
{
    public function show(Request $request, BackofficeConfirmation $confirmation): View|RedirectResponse
    {
        if ($confirmation->isValid($request)) {
            return redirect($confirmation->destination($request));
        }

        return view('backoffice-password');
    }

    public function confirm(Request $request, BackofficeConfirmation $confirmation): RedirectResponse
    {
        $key = 'backoffice-password:'.$request->user()->getAuthIdentifier();
        if (RateLimiter::tooManyAttempts($key, 5)) {
            throw ValidationException::withMessages(['password' => 'Zbyt wiele prób. Spróbuj ponownie za '.RateLimiter::availableIn($key).' s.']);
        }

        $data = $request->validate(['password' => ['required', 'string', 'max:1024']], [
            'password.required' => 'Wpisz hasło do swojego konta.',
            'password.string' => 'Wpisz poprawne hasło.',
            'password.max' => 'Hasło jest zbyt długie.',
        ]);
        RateLimiter::hit($key, 60);
        if (! Hash::check($data['password'], $request->user()->getAuthPassword())) {
            throw ValidationException::withMessages(['password' => 'Nieprawidłowe hasło. Spróbuj ponownie.']);
        }

        RateLimiter::clear($key);
        $request->session()->migrate(true);

        return redirect($confirmation->destination($request))->withCookie($confirmation->cookie($request));
    }
}
