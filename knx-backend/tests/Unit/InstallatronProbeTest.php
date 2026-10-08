<?php

namespace Tests\Unit;

use App\Support\InstallatronProbe;
use PHPUnit\Framework\TestCase;

class InstallatronProbeTest extends TestCase
{
    public function test_only_a_fresh_server_owned_probe_can_be_resolved(): void
    {
        $root = sys_get_temp_dir().'/knx-probe-'.bin2hex(random_bytes(8));
        mkdir($root, 0700);
        $name = '/deleteme.cha'.str_repeat('a', 32).'.php';
        file_put_contents($root.'/artisan', 'fixture');
        file_put_contents($root.$name, '<?php echo "fixture";');
        $server = ['REQUEST_METHOD' => 'POST', 'REMOTE_ADDR' => '185.208.164.78', 'REQUEST_URI' => $name.'?n=1'];
        try {
            $this->assertSame($root.$name, InstallatronProbe::resolve($server, $root, time()));
            foreach ([
                ['REMOTE_ADDR' => '203.0.113.10', 'HTTP_X_FORWARDED_FOR' => '185.208.164.78'],
                ['REQUEST_METHOD' => 'GET'],
                ['REQUEST_URI' => '/hosting-probe.php?file='.$name],
                ['REQUEST_URI' => '/.env'],
                ['REQUEST_URI' => '/%2e%2e'.$name],
                ['REQUEST_URI' => '/nested'.$name],
                ['REQUEST_URI' => $name.'/extra'],
                ['REQUEST_URI' => str_replace('a', 'b', $name)],
            ] as $change) {
                $this->assertNull(InstallatronProbe::resolve(array_replace($server, $change), $root, time()));
            }
            touch($root.$name, time() - 901);
            clearstatcache();
            $this->assertNull(InstallatronProbe::resolve($server, $root, time()));
            unlink($root.$name);
            symlink($root.'/artisan', $root.$name);
            clearstatcache();
            $this->assertNull(InstallatronProbe::resolve($server, $root, time()));
        } finally {
            unlink($root.$name);
            unlink($root.'/artisan');
            rmdir($root);
        }
    }
}
