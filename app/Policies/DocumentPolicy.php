<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Document;

// §6 de la Spécification API : "seul le propriétaire (ou un administrateur) peut agir
// sur le document" — conformément à la RG-01 du Dossier de conception détaillée.
// Le contournement "administrateur" est désormais arbitré par la permission Spatie
// "documents.voir-tous" (accordée au rôle administrateur, cf. RolePermissionSeeder)
// plutôt que par un champ "role" en dur.
class DocumentPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct() {
        //
    }

    public function view(User $user, Document $document): bool {

        return $user->can('documents.voir-tous') || $document->user_id === $user->id;
    }

    public function update(User $user, Document $document): bool {

        return $user->can('documents.voir-tous') || $document->user_id === $user->id;
    }

    public function delete(User $user, Document $document): bool {

        return $user->can('documents.voir-tous') || $document->user_id === $user->id;
    }

    public function restore(User $user, Document $document): bool {

        return $user->can('documents.voir-tous') || $document->user_id === $user->id;
    }
}
