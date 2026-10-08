<?php

namespace Tests\Feature;

use App\Models\Document;
use App\Models\Project;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class PlannerTest extends TestCase
{
    use RefreshDatabase;

    private User $owner;

    private string $token = 'test-csrf-token';

    protected function setUp(): void
    {
        parent::setUp();
        $this->owner = User::factory()->create(['active' => true, 'role' => 'member']);
        Storage::fake('local');
    }

    private function payload(): array
    {
        $p = json_decode(file_get_contents(__DIR__.'/../Fixtures/project.json'), true);
        $p['id'] = (string) Str::uuid();

        return $p;
    }

    private function save(array $p, ?User $user = null)
    {
        return $this->actingAs($user ?? $this->owner)->withSession(['_token' => $this->token])->putJson('/api?api=save', $p, ['X-CSRF-Token' => $this->token]);
    }

    private function createProject(): array
    {
        return $this->save($this->payload())->assertOk()->json('project');
    }

    public function test_anonymous_api_and_editor_are_protected(): void
    {
        $this->getJson('/api?api=projects')->assertUnauthorized();
        $this->get('/editor')->assertRedirect('/admin/login');
    }

    public function test_round_trip_preserves_room_points_key_actions_and_plan_view(): void
    {
        $p = $this->createProject();
        $d = Document::create(['id' => (string) Str::uuid(), 'project_id' => $p['id'], 'name' => 'plan.pdf', 'mime' => 'application/pdf', 'size' => 100, 'path' => 'private/plan']);
        $p['points'][0]['placement'] = ['documentId' => $d->id, 'page' => 1, 'x' => 0.321, 'y' => 0.765];
        $p['points'][0]['bindings'][0]['hold'] = ['target' => $p['rooms'][0]['circuits'][0]['id'], 'action' => 'Ściemnianie'];
        $p['planView'] = ['documentId' => $d->id, 'page' => 1, 'zoom' => 2.5, 'centerX' => 0.6, 'centerY' => 0.3];
        $p['rooms'][0]['planArea'] = ['documentId' => $d->id, 'page' => 1, 'x' => 0.1, 'y' => 0.2, 'width' => 0.3, 'height' => 0.4];
        $p['scenes'][0]['roomId'] = $p['rooms'][0]['id'];
        $this->save($p)->assertOk();
        $saved = $this->getJson('/api?api=project&id='.$p['id'])->assertOk()->json('project');
        $this->assertSame($p['points'], $saved['points']);
        $this->assertSame($p['planView'], $saved['planView']);
        $this->assertSame($p['rooms'], $saved['rooms']);
        $this->assertSame($p['scenes'], $saved['scenes']);
        $this->assertSame(2, $saved['revision']);
        $this->assertDatabaseCount('project_revisions', 2);
    }

    public function test_other_users_cannot_read_overwrite_or_list_a_project(): void
    {
        $p = $this->createProject();
        $other = User::factory()->create(['active' => true]);
        $this->actingAs($other)->getJson('/api?api=project&id='.$p['id'])->assertNotFound();
        $this->getJson('/api?api=projects')->assertJsonCount(0, 'projects');
        $this->save($p, $other)->assertNotFound();
        $this->get('/projects/'.$p['id'].'/download')->assertNotFound();
    }

    public function test_shared_member_can_edit_but_cannot_manage_users_or_sharing(): void
    {
        $p = $this->createProject();
        $other = User::factory()->create(['active' => true]);
        $project = Project::findOrFail($p['id']);
        $project->members()->attach($other);
        $this->save($p, $other)->assertOk();
        $this->assertFalse($other->can('share', $project));
        $this->assertFalse($other->can('viewAny', User::class));
        $this->get('/admin/users')->assertForbidden();
    }

    public function test_disabled_user_is_rejected_even_with_an_existing_session(): void
    {
        $p = $this->createProject();
        $this->owner->update(['active' => false]);
        $this->save($p)->assertForbidden();
    }

    public function test_missing_csrf_and_wrong_http_method_are_rejected(): void
    {
        $this->actingAs($this->owner)->putJson('/api?api=save', $this->payload())->assertStatus(419);
        $this->getJson('/api?api=save')->assertStatus(405);
    }

    public function test_stale_revision_cannot_overwrite_another_edit(): void
    {
        $p = $this->createProject();
        $new = $p;
        $new['name'] = 'Nowsza wersja';
        $this->save($new)->assertOk();
        $this->save($p)->assertConflict();
        $this->assertSame('Nowsza wersja', Project::find($p['id'])->name);
    }

    public function test_invalid_references_coordinates_and_duplicate_ids_are_rejected(): void
    {
        $p = $this->payload();
        $p['points'][0]['roomId'] = (string) Str::uuid();
        $this->save($p)->assertUnprocessable();
        $p = $this->payload();
        $p['points'][0]['bindings'][0]['target'] = (string) Str::uuid();
        $this->save($p)->assertUnprocessable();
        $p = $this->payload();
        $p['rooms'][] = $p['rooms'][0];
        $this->save($p)->assertUnprocessable();
        $p = $this->createProject();
        $d = Document::create(['id' => (string) Str::uuid(), 'project_id' => $p['id'], 'name' => 'x.pdf', 'mime' => 'application/pdf', 'size' => 100, 'path' => 'x']);
        $p['points'][0]['placement'] = ['documentId' => $d->id, 'page' => 1, 'x' => 1.1, 'y' => 0.5];
        $this->save($p)->assertUnprocessable();
    }

    public function test_room_areas_and_scene_room_references_are_validated(): void
    {
        $p = $this->createProject();
        $d = Document::create(['id' => (string) Str::uuid(), 'project_id' => $p['id'], 'name' => 'plan.pdf', 'mime' => 'application/pdf', 'size' => 100, 'path' => 'plan']);
        $p['rooms'][0]['planArea'] = ['documentId' => $d->id, 'page' => 1, 'x' => 0.8, 'y' => 0.2, 'width' => 0.4, 'height' => 0.3];
        $this->save($p)->assertUnprocessable();
        $p['rooms'][0]['planArea']['width'] = 0;
        $this->save($p)->assertUnprocessable();
        $p['rooms'][0]['planArea']['width'] = 0.1;
        $p['rooms'][0]['planArea']['documentId'] = (string) Str::uuid();
        $this->save($p)->assertUnprocessable();
        unset($p['rooms'][0]['planArea']);
        $p['scenes'][0]['roomId'] = (string) Str::uuid();
        $this->save($p)->assertUnprocessable();
        $this->assertDatabaseHas('projects', ['id' => $p['id'], 'revision' => 1]);
    }

    public function test_client_cannot_attach_a_foreign_document_or_escalate_ownership(): void
    {
        $p = $this->createProject();
        $other = User::factory()->create(['active' => true]);
        $foreign = (string) Str::uuid();
        $p['attachments'] = [['id' => $foreign, 'mime' => 'application/pdf', 'name' => 'x', 'size' => 1]];
        $p['points'][0]['placement'] = ['documentId' => $foreign, 'page' => 1, 'x' => 0.5, 'y' => 0.5];
        $this->save($p)->assertUnprocessable();
        unset($p['points'][0]['placement']);
        $p['owner_id'] = $other->id;
        $this->save($p)->assertOk();
        $this->assertSame($this->owner->id, Project::find($p['id'])->owner_id);
    }

    public function test_upload_is_private_revision_checked_and_scoped(): void
    {
        $p = $this->createProject();
        $id = (string) Str::uuid();
        $this->withSession(['_token' => $this->token])->post('/api?api=upload&project='.$p['id'].'&id='.$id,
            ['revision' => $p['revision'], 'file' => UploadedFile::fake()->image('sensor.png')], ['X-CSRF-Token' => $this->token, 'Accept' => 'application/json'])->assertOk();
        $this->get('/api?api=file&project='.$p['id'].'&id='.$id)->assertOk()->assertHeader('Content-Type', 'image/png');
        $this->actingAs(User::factory()->create(['active' => true]))->getJson('/api?api=file&project='.$p['id'].'&id='.$id)->assertNotFound();
        $this->assertDatabaseCount('documents', 1);
    }

    public function test_executable_disguised_as_image_is_rejected(): void
    {
        $p = $this->createProject();
        $this->withSession(['_token' => $this->token])->post('/api?api=upload&project='.$p['id'].'&id='.Str::uuid(),
            ['revision' => $p['revision'], 'file' => UploadedFile::fake()->createWithContent('photo.png', '<?php echo 1;')], ['X-CSRF-Token' => $this->token, 'Accept' => 'application/json'])->assertUnprocessable();
    }

    public function test_submission_is_immutable_idempotent_and_not_public(): void
    {
        $p = $this->createProject();
        $id = (string) Str::uuid();
        $body = ['id' => $p['id'], 'revision' => $p['revision'], 'submissionId' => $id, 'consent' => true];
        $p = $this->postJson('/api?api=submit', $body, ['X-CSRF-Token' => $this->token])->assertOk()->json('project');
        $this->postJson('/api?api=submit', $body, ['X-CSRF-Token' => $this->token])->assertOk();
        $this->assertDatabaseCount('project_submissions', 1);
        $p['name'] = 'Nowa nazwa';
        $this->save($p)->assertOk();
        $this->getJson('/api?api=submission&project='.$p['id'].'&id='.$id)->assertOk()->assertJsonPath('project.name', 'TEST AUTOMATYCZNY KNX');
        $this->actingAs(User::factory()->create(['active' => true]))->getJson('/api?api=submission&project='.$p['id'].'&id='.$id)->assertNotFound();
    }

    public function test_detaching_document_clears_map_and_photo_but_keeps_submitted_file(): void
    {
        $p = $this->createProject();
        $id = (string) Str::uuid();
        Storage::disk('local')->put('test.pdf', '%PDF-1.7 test');
        Document::create(['id' => $id, 'project_id' => $p['id'], 'name' => 'test.pdf', 'mime' => 'application/pdf', 'size' => 13, 'path' => 'test.pdf']);
        $p['points'][0]['placement'] = ['documentId' => $id, 'page' => 1, 'x' => 0.5, 'y' => 0.5];
        $p['rooms'][0]['planArea'] = ['documentId' => $id, 'page' => 1, 'x' => 0.1, 'y' => 0.1, 'width' => 0.5, 'height' => 0.5];
        $p = $this->save($p)->json('project');
        $p = $this->postJson('/api?api=submit', ['id' => $p['id'], 'revision' => $p['revision'], 'submissionId' => (string) Str::uuid(), 'consent' => true], ['X-CSRF-Token' => $this->token])->json('project');
        $r = $this->postJson('/api?api=remove-file', ['project' => $p['id'], 'revision' => $p['revision'], 'id' => $id], ['X-CSRF-Token' => $this->token])->assertOk();
        $this->assertArrayNotHasKey('placement', $r->json('project.points.0'));
        $this->assertArrayNotHasKey('planArea', $r->json('project.rooms.0'));
        $r->assertJsonCount(0, 'project.attachments');
        $this->get('/api?api=file&project='.$p['id'].'&id='.$id)->assertOk();
    }

    public function test_admin_panel_and_editor_render(): void
    {
        $admin = User::factory()->create(['active' => true, 'role' => 'admin']);
        $this->actingAs($admin)->get('/admin/projects')->assertOk();
        $this->get('/admin/users')->assertOk();
        $this->get('/editor')->assertOk()->assertSee('csrf-token')->assertSee('knx-api');
    }

    #[DataProvider('malformedNestedValues')]
    public function test_malformed_nested_data_returns_422_without_changing_the_project(string $path, mixed $value): void
    {
        $p = $this->createProject();
        data_set($p, $path, $value);

        $this->save($p)->assertUnprocessable();

        $this->assertDatabaseHas('projects', ['id' => $p['id'], 'revision' => 1]);
        $this->assertDatabaseCount('project_revisions', 1);
    }

    public static function malformedNestedValues(): array
    {
        return [
            'room is a string' => ['rooms.0', 'invalid'],
            'point is a string' => ['points.0', 'invalid'],
            'circuit is a number' => ['rooms.0.circuits.0', 42],
            'binding is a string' => ['points.0.bindings.0', 'invalid'],
            'document identifier is an array' => ['points.0.placement', ['documentId' => [], 'page' => 1, 'x' => 0.5, 'y' => 0.5]],
            'photo identifier is an array' => ['points.0.photoId', []],
            'room area is a string' => ['rooms.0.planArea', 'invalid'],
            'scene room is an array' => ['scenes.0.roomId', []],
        ];
    }
}
