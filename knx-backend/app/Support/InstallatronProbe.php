<?php

namespace App\Support;

final class InstallatronProbe
{
    /** Resolve only fresh probes created by CF in the protected application root. */
    public static function resolve(array $server, string $root, int $now): ?string
    {
        if (($server['REQUEST_METHOD'] ?? '') !== 'POST'
            || ($server['REMOTE_ADDR'] ?? '') !== '185.208.164.78') {
            return null;
        }

        $path = parse_url($server['REQUEST_URI'] ?? '', PHP_URL_PATH);
        if (! is_string($path) || ! preg_match('~\A/deleteme\.cha[a-f0-9]{32}\.php\z~D', $path)) {
            return null;
        }

        $root = realpath($root);
        if ($root === false) {
            return null;
        }

        $file = $root.$path;
        if (! is_file($file) || is_link($file) || realpath($file) !== $file
            || ! is_file($root.'/artisan') || fileowner($file) !== fileowner($root.'/artisan')
            || filesize($file) > 1024 * 1024 || filemtime($file) < $now - 900 || filemtime($file) > $now + 60) {
            return null;
        }

        return $file;
    }
}
