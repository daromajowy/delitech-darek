<?php

namespace Tests\Feature;

use App\Models\Inquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class InquiryTest extends TestCase
{
    use RefreshDatabase;

    private function payload(array $override = []): array
    {
        return array_merge(['kind' => 'project', 'name' => 'Test formularza', 'email' => 'test@example.com', 'phone' => '505260715', 'consentDataProcessing' => true, 'description' => '<script>alert(1)</script>'], $override);
    }

    private function submit(array $data = [], array $files = [], string $origin = 'https://intelispaces.pl')
    {
        return $this->post('/api/inquiries', ['payload' => json_encode($this->payload($data)), 'files' => $files], ['Accept' => 'application/json', 'Origin' => $origin]);
    }

    public function test_submission_is_encrypted_and_private_attachment_requires_an_admin(): void
    {
        Storage::fake('local');
        $file = UploadedFile::fake()->createWithContent('rzut.pdf', "%PDF-1.4\n1 0 obj\n<<>>\nendobj\n%%EOF");
        $this->submit([], [$file])->assertCreated()->assertJsonStructure(['reference'])->assertJsonMissing(['email' => 'test@example.com']);
        $record = Inquiry::sole();
        $this->assertStringNotContainsString('test@example.com', DB::table('inquiries')->value('payload'));
        $this->assertSame('test@example.com', $record->payload['email']);
        Storage::disk('local')->assertExists($record->files[0]['path']);
        $url = route('inquiries.download', [$record, 0]);
        $this->getJson($url)->assertUnauthorized();
        $member = User::factory()->create(['active' => true, 'role' => 'member']);
        $this->actingAs($member)->get($url)->assertForbidden();
        $this->get(route('inquiries.show', $record))->assertForbidden();
        $this->get('/admin/inquiries')->assertForbidden();
        $admin = User::factory()->create(['active' => true, 'role' => 'admin']);
        $this->actingAs($admin)->get($url)->assertOk()->assertDownload('rzut.pdf');
        $this->get(route('inquiries.show', $record))->assertOk()->assertDontSee('<script>alert(1)</script>', false)->assertSee('&lt;script&gt;alert(1)&lt;/script&gt;', false);
        $this->get('/admin/inquiries')->assertOk();
        $admin->update(['active' => false]);
        $this->get($url)->assertForbidden();
    }

    public function test_forms_reject_other_origins_missing_consent_and_executable_uploads(): void
    {
        Storage::fake('local');
        $this->submit(origin: 'https://evil.example')->assertForbidden();
        $this->submit(origin: '')->assertForbidden();
        $this->submit(['consentDataProcessing' => false])->assertUnprocessable();
        $this->submit(['email' => 'invalid'])->assertUnprocessable();
        $this->submit(files: [UploadedFile::fake()->createWithContent('plan.pdf', '<?php echo "unsafe";')])->assertUnprocessable();
        $this->submit(files: [UploadedFile::fake()->createWithContent('shell.php', '%PDF-1.4')])->assertUnprocessable();
        $this->assertDatabaseCount('inquiries', 0);
        $this->assertSame([], Storage::disk('local')->allFiles());
    }

    public function test_valid_consultation_and_limits(): void
    {
        $this->submit(['kind' => 'consultation', 'consentDataProcessing' => true])->assertCreated();
        for ($i = 1; $i < 10; $i++) {
            $this->submit()->assertCreated();
        }
        $this->submit()->assertTooManyRequests();
        $this->assertDatabaseCount('inquiries', 10);
    }

    public function test_cors_is_limited_to_public_forms_and_does_not_open_project_api(): void
    {
        $headers = ['Origin' => 'https://intelispaces.pl', 'Access-Control-Request-Method' => 'POST', 'Access-Control-Request-Headers' => 'content-type'];
        $this->options('/api/inquiries', [], $headers)->assertNoContent()->assertHeader('Access-Control-Allow-Origin', 'https://intelispaces.pl')->assertHeaderMissing('Access-Control-Allow-Credentials');
        $this->options('/api/inquiries', [], array_merge($headers, ['Origin' => 'https://evil.example']))->assertHeaderMissing('Access-Control-Allow-Origin');
        $this->getJson('/api?api=projects', ['Origin' => 'https://intelispaces.pl'])->assertUnauthorized()->assertHeaderMissing('Access-Control-Allow-Origin');
    }
}
