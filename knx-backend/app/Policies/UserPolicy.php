<?php

namespace App\Policies;

use App\Models\User;

class UserPolicy
{
    public function viewAny(User $u): bool
    {
        return $u->isAdmin();
    }

    public function view(User $u, User $record): bool
    {
        return $u->isAdmin();
    }

    public function create(User $u): bool
    {
        return $u->isAdmin();
    }

    public function update(User $u, User $record): bool
    {
        return $u->isAdmin();
    }

    public function delete(User $u, User $record): bool
    {
        return false;
    }
}
