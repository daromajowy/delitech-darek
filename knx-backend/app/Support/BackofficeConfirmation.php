<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cookie;
use Symfony\Component\HttpFoundation\Cookie as HttpCookie;

final class BackofficeConfirmation
{
    public const COOKIE = 'knx_backoffice_confirmation';

    public const INTENDED = 'knx.backoffice_intended';

    public function isValid(Request $request): bool
    {
        $user = $request->user();
        $value = $request->cookie(self::COOKIE);
        $confirmation = is_string($value) ? json_decode($value, true) : null;

        if (! $user instanceof User || ! $user->active || ! is_array($confirmation)
            || ! is_int($confirmation['confirmed_at'] ?? null)
            || ! is_string($confirmation['account'] ?? null)) {
            return false;
        }

        $age = now()->timestamp - $confirmation['confirmed_at'];

        return $age >= 0 && $age < 72 * 60 * 60
            && hash_equals($this->accountFingerprint($user), $confirmation['account']);
    }

    public function cookie(Request $request): HttpCookie
    {
        return new HttpCookie(
            self::COOKIE,
            json_encode(['confirmed_at' => now()->timestamp, 'account' => $this->accountFingerprint($request->user())], JSON_THROW_ON_ERROR),
            now()->addHours(72),
            '/',
            null,
            $request->isSecure() || ! app()->environment(['local', 'testing']),
            true,
            false,
            'lax',
        );
    }

    public function forget(): void
    {
        Cookie::queue(new HttpCookie(self::COOKIE, null, 1, '/', null, ! app()->environment(['local', 'testing']), true, false, 'lax'));
    }

    public function destination(Request $request): string
    {
        $intended = $request->session()->pull(self::INTENDED);
        if (is_string($intended)
            && preg_match('~^/(admin(?:/|\?|$)|inquiries/)~', $intended)
            && ! str_starts_with($intended, '/admin/confirm-password')
            && ! str_contains($intended, '\\')
            && ! preg_match('/[\r\n]/', $intended)) {
            return $intended;
        }

        return route('filament.admin.pages.dashboard');
    }

    private function accountFingerprint(User $user): string
    {
        return hash_hmac('sha256', json_encode([
            $user->getAuthIdentifier(), $user->getAuthPassword(), (int) $user->planner_access_version,
        ], JSON_THROW_ON_ERROR), config('app.key'));
    }
}
