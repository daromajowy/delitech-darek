<?php

namespace Tests;

use App\Models\User;
use App\Support\BackofficeConfirmation;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Cookie;

abstract class TestCase extends BaseTestCase
{
    protected function confirmBackoffice(User $user, string $password = 'password'): static
    {
        Cookie::unqueue(BackofficeConfirmation::COOKIE);
        $response = $this->actingAs($user)->post(route('backoffice.password.confirm'), ['password' => $password]);
        $response->assertRedirect();

        return $this->withCookie(BackofficeConfirmation::COOKIE, $response->getCookie(BackofficeConfirmation::COOKIE)->getValue());
    }
}
