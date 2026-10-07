<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    public $incrementing = false;

    protected $keyType = 'string';

    protected $guarded = [];

    protected function casts(): array
    {
        return ['payload' => 'array', 'revision' => 'integer'];
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class);
    }

    public function documents(): HasMany
    {
        return $this->hasMany(Document::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(ProjectSubmission::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ProjectRevision::class);
    }

    public function scopeAccessibleTo(Builder $q, User $user): Builder
    {
        if (! $user->active) {
            return $q->whereRaw('1 = 0');
        }
        if ($user->isAdmin()) {
            return $q;
        }

        return $q->where(fn (Builder $s) => $s->where('owner_id', $user->id)->orWhereHas('members', fn (Builder $m) => $m->where('users.id', $user->id)));
    }

    public function canEdit(User $user): bool
    {
        return $user->active && ($user->isAdmin() || $this->owner_id === $user->id || $this->members()->whereKey($user->id)->exists());
    }

    public function documentList(): array
    {
        return $this->documents()->where('active', true)->get(['id', 'name', 'size', 'mime'])->toArray();
    }

    public function toPlanner(): array
    {
        return array_merge($this->payload, [
            'id' => $this->id, 'name' => $this->name, 'studio' => $this->studio,
            'revision' => $this->revision, 'updatedAt' => $this->updated_at->toIso8601String(),
            'attachments' => $this->documentList(),
            'submissions' => $this->submissions()->orderBy('created_at')->get()->map(fn ($s) => [
                'id' => $s->id, 'revision' => $s->revision, 'createdAt' => $s->created_at->toIso8601String(),
            ])->all(),
        ]);
    }
}
