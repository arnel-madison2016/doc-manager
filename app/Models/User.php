<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Traits\HasRoles;

// cf. §4.1 du Dossier de conception détaillée (Table users). La gestion des rôles
// (Utilisateur / Administrateur, §9.2 Cahier des charges) et des permissions fines
// (ex. "categories.gerer", "documents.voir-tous") est déléguée au trait HasRoles
// fourni par spatie/laravel-permission — cf. database/seeders/RolePermissionSeeder.php
// pour la définition des rôles et permissions du projet.
class User extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected $fillable = [
        'nom',
        'email',
        'password',
        'avatar_path',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // Conservée comme raccourci de lisibilité dans les contrôleurs/policies ;
    // s'appuie désormais sur le rôle Spatie plutôt que sur une colonne "role".
    public function isAdmin(): bool {

        return $this->hasRole('administrateur');
    }

    public function documents() {

        return $this->hasMany(Document::class);
    }

    public function journalActions() {

        return $this->hasMany(JournalAction::class);
    }

    // URL publique de la photo de profil (disque "public", cf. php artisan storage:link).
    // URL publique de la photo de profil (disque "public", cf. php artisan storage:link).
    // asset('storage/...') plutôt que Storage::disk('public')->url(...) : cette dernière
    // méthode n'appartient pas au contrat Illuminate\Contracts\Filesystem\Filesystem
    // (seulement à son implémentation concrète FilesystemAdapter), ce qui déclenche une
    // erreur "undefined method" en analyse statique bien que fonctionnelle à l'exécution.
    public function avatarUrl(): ?string {

        return $this->avatar_path ? asset('storage/'.$this->avatar_path) : null;
    }

    // Représentation JSON homogène de l'utilisateur, partagée par AuthController
    // et ProfileController, afin d'éviter toute divergence de champs exposés.
    public function toApiArray(): array {
        
        return [
            ...$this->only('id', 'nom', 'email'),
            'avatar_url' => $this->avatarUrl(),
            'roles' => $this->getRoleNames(),
        ];
    }
}
