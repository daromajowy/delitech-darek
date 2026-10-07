<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $u): bool
    {
        return $u->active;
    }

    public function view(User $u, Project $p): bool
    {
        return $p->canEdit($u);
    }

    public function update(User $u, Project $p): bool
    {
        return $p->canEdit($u);
    }

    public function create(User $u): bool
    {
        return $u->active;
    }

    public function delete(User $u, Project $p): bool
    {
        return false;
    }

    public function share(User $u, Project $p): bool
    {
        return $u->isAdmin() || ($u->active && $p->owner_id === $u->id);
    }
}
