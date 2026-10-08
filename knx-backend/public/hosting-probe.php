<?php

use App\Support\InstallatronProbe;

// Installatron writes its temporary probe outside the public document root.
// This bridge never boots Laravel or accepts a path supplied in a query parameter.
require dirname(__DIR__).'/app/Support/InstallatronProbe.php';

$probe = InstallatronProbe::resolve($_SERVER, dirname(__DIR__), time());
if ($probe === null) {
    http_response_code(404);
    exit;
}

require $probe;
