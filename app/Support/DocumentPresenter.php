<?php

namespace App\Support;

use App\Models\Categorie;
use App\Models\Document;
use App\Models\DocumentVersion;

class DocumentPresenter
{
    /**
     * Create a new class instance.
     */
    public function __construct() {        
        //
    }

    public static function toArray(Document $document): array {

        return [
            'id' => $document->id,
            'titre' => $document->titre,
            'description' => $document->description,
            'type' => $document->type,
            'statut' => $document->statut,
            'categorie_id' => $document->categorie_id,
            'domaine_id' => $document->domaine_id,
            'categorie' => $document->relationLoaded('categorie') && $document->categorie
                ? ['id' => $document->categorie->id, 'name' => $document->categorie->namem, 'type' => $document->categorie->type]
                : null,
            'domaine' => $document->relationLoaded('domaine') && $document->domaine
                ? ['id' => $document->domaine->id, 'name' => $document->domaine->name]
                : null,
            'numero_acte' => $document->numero_acte,
            'type_acte' => $document->type_acte,
            'autorite_emettrice' => $document->autorite_emettrice,
            'date_signature' => $document->date_signature?->format('Y-m-d'),
            'auteur' => $document->auteur,
            'editeur' => $document->editeur,
            'isbn' => $document->isbn,
            'hash_sha256' => $document->hash_sha256,
            'version_active' => $document->relationLoaded('versionActive') ? $document->versionActive?->numero_version : null,
            'taille' => $document->relationLoaded('versionActive') ? $document->versionActive?->taille : null,
            'created_at' => $document->created_at?->toIso8601String(),
            'corbeille_at' => $document->corbeille_at?->toIso8601String(),
        ];
    }

    public static function version(DocumentVersion $version): array {
        
        return [
            'id' => $version->id,
            'numero_version' => $version->numero_version,
            'taille' => $version->taille,
            'est_active' => $version->est_active,
            'created_at' => $version->created_at?->toIso8601String(),
        ];
    }

    /** Arbre catégories > domaines pour les listes déroulantes (filtres, formulaires). */
    public static function categoriesTree(): array {

        return Categorie::query()
            ->with(['domaines' => fn ($q) => $q->orderBy('name')])
            ->orderBy('name')
            ->get()
            ->map(fn (Categorie $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'type' => $c->type,
                'domaines' => $c->domaines->map(fn ($d) => ['id' => $d->id, 'name' => $d->name])->values(),
            ])
            ->values()
            ->all();
    }
}
