<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\HttpException;

class AccountService
{
    /**
     * Create a new class instance.
     */
    public function __construct() {
        //
    }

    public function export(User $user): array {

        return [
            'profil' => $user->only(['id', 'name', 'email', 'created_at', 'last_login_at']),
            'preferences' => $user->preferences,
            'documents_metadonnees' => $user->documents()->with(['categorie', 'domaine'])->get()->toArray(),
            'export_at' => now()->toIso8601String(),
        ];
    }

    public function delete(User $user): void {

        // Refus si dernier administrateur
        if ($user->hasRole('administrateur') && User::role('administrateur')->count() <= 1) {
            abort(422, "Impossible de supprimer le dernier administrateur de l'application.");
        }

        DB::transaction(function () use ($user) {
            foreach ($user->documents as $document) {
                Storage::disk('local')->deleteDirectory("documents/{$document->id}");
            }

            if ($user->avatar_path) {
                Storage::disk('public')->delete($user->avatar_path);
            }
            
            $user->tokens()->delete();
            $user->documents()->delete();
            $user->delete();
        });
    }
}
