<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Project;
use App\Models\ProjectRevision;
use App\Models\ProjectSubmission;
use App\Models\User;
use App\Support\ProjectPayload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class PlannerController extends Controller
{
    public function dispatch(Request $r): array|StreamedResponse
    {
        $action = $r->query('api');
        $methods = ['session' => 'GET', 'projects' => 'GET', 'project' => 'GET', 'save' => 'PUT',
            'upload' => 'POST', 'file' => 'GET', 'remove-file' => 'POST', 'submit' => 'POST',
            'submission' => 'GET', 'logout' => 'POST', 'revisions' => 'GET', 'revision' => 'GET'];
        abort_unless(is_string($action) && isset($methods[$action]), 404);
        abort_unless($r->method() === $methods[$action], 405);

        return match ($action) {
            'session' => ['csrf' => csrf_token(), 'workspace' => 'InteliSpaces', 'user' => $r->user()->only('id', 'name', 'email', 'role')],
            'projects' => ['projects' => Project::accessibleTo($r->user())->latest('updated_at')->limit(200)->get()->map(fn ($p) => collect($p->toPlanner())->only(['id', 'name', 'studio', 'revision', 'updatedAt', 'submissions']))],
            'project' => ['project' => $this->project($r, $r->query('id'))->toPlanner()],
            'save' => $this->save($r), 'upload' => $this->upload($r), 'file' => $this->file($r),
            'remove-file' => $this->detach($r), 'submit' => $this->submit($r),
            'submission' => $this->submission($r), 'logout' => $this->logout($r),
            'revisions' => ['revisions' => $this->project($r, $r->query('project'))->revisions()->latest('revision')->get(['revision', 'created_at', 'author_id'])],
            'revision' => $this->revision($r),
        };
    }

    private function project(Request $r, mixed $id, bool $lock = false): Project
    {
        ProjectPayload::identifier($id);
        $query = Project::accessibleTo($r->user())->whereKey($id);

        return ($lock ? $query->lockForUpdate() : $query)->firstOrFail();
    }

    private function assertRevision(Project $p, mixed $revision): void
    {
        abort_unless(is_numeric($revision) && (string) (int) $revision === (string) $revision && $p->revision === (int) $revision,
            409, 'Ktoś zapisał nowszą wersję. Pobierz kopię JSON swoich zmian i otwórz projekt ponownie.');
    }

    private function record(Project $p, User $user): array
    {
        $p->revision++;
        $p->save();
        $payload = $p->toPlanner();
        $p->revisions()->create(['revision' => $p->revision, 'author_id' => $user->id, 'payload' => $payload, 'created_at' => now()]);
        $old = $p->revisions()->orderByDesc('revision')->skip(30)->take(1000)->pluck('id');
        if ($old->isNotEmpty()) {
            ProjectRevision::whereIn('id', $old)->delete();
        }

        return ['project' => $payload];
    }

    private function save(Request $r): array
    {
        abort_if(strlen($r->getContent()) > 1000000, 413, 'Projekt jest zbyt duży.');
        $data = $r->json()->all();
        ProjectPayload::identifier($data['id'] ?? null);

        return DB::transaction(function () use ($r, $data) {
            // Serialize creation quotas with other writes from the same owner.
            User::whereKey($r->user()->id)->lockForUpdate()->firstOrFail();
            $p = Project::whereKey($data['id'])->lockForUpdate()->first();
            if ($p) {
                abort_unless($p->canEdit($r->user()), 404);
                $this->assertRevision($p, $data['revision'] ?? null);
            } else {
                abort_unless(($data['revision'] ?? null) === 0, 409, 'Projekt nie istnieje.');
                abort_if(Project::where('owner_id', $r->user()->id)->count() >= 100, 422, 'Limit 100 projektów.');
                $p = new Project(['id' => $data['id'], 'owner_id' => $r->user()->id, 'revision' => 0]);
            }
            // Attachment identities and immutable submissions are always server-owned.
            $data['attachments'] = $p->exists ? $p->documentList() : [];
            $data['submissions'] = [];
            ProjectPayload::validate($data);
            $p->name = trim($data['name']);
            $p->studio = $data['studio'];
            $p->payload = collect($data)->except(['attachments', 'submissions', 'owner_id', 'revision', 'updatedAt'])->all();

            return $this->record($p, $r->user());
        });
    }

    private function upload(Request $r): array
    {
        $r->validate(['file' => ['required', 'file', 'max:12288', 'mimetypes:application/pdf,image/jpeg,image/png']]);
        ProjectPayload::identifier($r->query('id'));
        $file = $r->file('file');
        $mime = $file->getMimeType();
        if ($mime === 'application/pdf') {
            $handle = fopen($file->getRealPath(), 'rb');
            $magic = fread($handle, 5);
            fclose($handle);
            abort_unless($magic === '%PDF-', 422, 'Nieprawidłowy plik PDF.');
        } else {
            $info = @getimagesize($file->getRealPath());
            abort_unless($info && $info[0] * $info[1] <= 40000000, 422, 'Obraz może mieć najwyżej 40 megapikseli.');
        }
        $stored = null;
        try {
            return DB::transaction(function () use ($r, $file, $mime, &$stored) {
                $p = $this->project($r, $r->query('project'), true);
                $this->assertRevision($p, $r->input('revision'));
                abort_if($p->documents()->where('active', true)->count() >= 20, 422, 'Limit 20 dokumentów w projekcie.');
                abort_if($p->documents()->sum('size') + $file->getSize() > 256 * 1024 * 1024, 422, 'Limit 256 MB dokumentów projektu.');
                abort_if(Document::whereKey($r->query('id'))->exists(), 409, 'Dokument o tym identyfikatorze już istnieje.');
                $stored = $file->storeAs('projects/'.$p->id, $r->query('id'), 'local');
                abort_unless($stored, 500, 'Nie udało się zapisać pliku.');
                $p->documents()->create(['id' => $r->query('id'), 'name' => mb_substr(preg_replace('/[\x00-\x1f\x7f\/\\\\]/u', '_', $file->getClientOriginalName()), 0, 240),
                    'path' => $stored, 'size' => $file->getSize(), 'mime' => $mime]);

                return $this->record($p, $r->user());
            });
        } catch (\Throwable $error) {
            if ($stored) {
                Storage::disk('local')->delete($stored);
            } throw $error;
        }
    }

    private function file(Request $r): StreamedResponse
    {
        $p = $this->project($r, $r->query('project'));
        ProjectPayload::identifier($r->query('id'));
        $d = $p->documents()->findOrFail($r->query('id'));
        abort_unless($d->active || $p->submissions()->get()->contains(fn ($s) => in_array($d->id, array_column($s->payload['attachments'] ?? [], 'id'), true)), 404);

        return Storage::disk('local')->response($d->path, $d->name, ['Content-Type' => $d->mime, 'Cache-Control' => 'private, no-store', 'X-Content-Type-Options' => 'nosniff'], 'attachment');
    }

    private function detach(Request $r): array
    {
        ProjectPayload::identifier($r->input('id'));

        return DB::transaction(function () use ($r) {
            $p = $this->project($r, $r->input('project'), true);
            $this->assertRevision($p, $r->input('revision'));
            $d = $p->documents()->where('active', true)->findOrFail($r->input('id'));
            $d->update(['active' => false]);
            $data = $p->payload;
            foreach ($data['rooms'] as &$room) {
                if (($room['planArea']['documentId'] ?? null) === $d->id) {
                    unset($room['planArea']);
                }
            }
            unset($room);
            foreach ($data['points'] as &$pt) {
                if (($pt['placement']['documentId'] ?? null) === $d->id) {
                    unset($pt['placement']);
                }
                if (($pt['photoId'] ?? null) === $d->id) {
                    unset($pt['photoId']);
                }
            }
            unset($pt);
            if (($data['planView']['documentId'] ?? null) === $d->id) {
                unset($data['planView']);
            }
            $p->payload = $data;

            return $this->record($p, $r->user());
        });
    }

    private function submit(Request $r): array
    {
        abort_unless($r->input('consent') === true, 422, 'Potwierdź przekazanie briefu.');
        ProjectPayload::identifier($r->input('submissionId'));

        return DB::transaction(function () use ($r) {
            $p = $this->project($r, $r->input('id'), true);
            $existing = $p->submissions()->find($r->input('submissionId'));
            if ($existing) {
                return ['project' => $p->toPlanner()];
            }
            $this->assertRevision($p, $r->input('revision'));
            abort_if(ProjectSubmission::whereKey($r->input('submissionId'))->exists(), 409);
            $p->submissions()->create(['id' => $r->input('submissionId'), 'revision' => $p->revision, 'payload' => $p->toPlanner(), 'author_id' => $r->user()->id, 'created_at' => now()]);
            $p->status = 'submitted';

            return $this->record($p, $r->user());
        });
    }

    private function submission(Request $r): array
    {
        ProjectPayload::identifier($r->query('id'));
        $p = $this->project($r, $r->query('project'));

        return ['project' => $p->submissions()->findOrFail($r->query('id'))->payload];
    }

    private function revision(Request $r): array
    {
        $r->validate(['revision' => ['required', 'integer', 'min:1']]);
        $p = $this->project($r, $r->query('project'));

        return ['project' => $p->revisions()->where('revision', $r->query('revision'))->firstOrFail()->payload];
    }

    private function logout(Request $r): array
    {
        Auth::logout();
        $r->session()->invalidate();
        $r->session()->regenerateToken();

        return ['ok' => true];
    }
}
