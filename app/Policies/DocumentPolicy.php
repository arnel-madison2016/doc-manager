<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Document;

class DocumentPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function view(User $user, Document $document): bool {
        
        return $user->isAdmin() || $document->user_id === $user->id;
    }

    public function update(User $user, Document $document): bool {

        return $user->isAdmin() || $document->user_id === $user->id;
    }

    public function delete(User $user, Document $document): bool {

        return $user->isAdmin() || $document->user_id === $user->id;
    }

    public function restore(User $user, Document $document): bool {

        return $user->isAdmin() || $document->user_id === $user->id;
    }
}
