<?php

return [
    'paths' => ['api/inquiries'],
    'allowed_methods' => ['POST', 'OPTIONS'],
    'allowed_origins' => env('APP_ENV') === 'staging'
        ? ['https://staging.intelispaces.pl']
        : ['https://intelispaces.pl', 'https://www.intelispaces.pl'],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['Accept', 'Content-Type'],
    'exposed_headers' => [],
    'max_age' => 600,
    'supports_credentials' => false,
];
