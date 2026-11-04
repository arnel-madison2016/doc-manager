<?php

namespace App\Services;

use App\Models\AppSetting;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\JournalAction;
use App\Models\User;
use App\Exceptions\DuplicateDocumentException;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    // Déclaration du mapping entre le type de document et la nature de la catégorie
    public const TYPE_TO_CATEGORIE = [
        'texte_administratif' => 'texte_administratif',
        'livre_personnel' => 'livre_personnel',
        'autre' => 'autre',
        // Ajoutez d'autres correspondances si nécessaire selon vos types
    ];

    // Date de référence d'un document : signature pour un acte, sinon date d'ajout (§4.2 Spéc. API).
    private const DATE_EXPR = 'COALESCE(date_signature, DATE(created_at))';

    /** Règles de validation d'un PDF déposé ; la taille maximale vient des paramètres globaux. */
    public function fileRules(bool $required = true): array {

        $maxKo = (int) AppSetting::read('upload_taille_max_mo', 50) * 1024;

        return [$required ? 'required' : 'nullable', 'file', 'mimetypes:application/pdf', 'mimes:pdf', 'max:'.$maxKo];
    }

    /** Documents visibles par l'utilisateur : les siens, ou tous avec la permission documents.voir-tous. */
    public function scoped(User $user): Builder {

        return Document::query()
            ->when($user->cannot('documents.voir-tous'), fn (Builder $q) => $q->where('user_id', $user->id));
    }

    /** Recherche multicritère hors corbeille (EF-06, EF-07). */
    public function search(User $user, array $filters = []): Builder {

        $query = $this->scoped($user)
            ->with(['categorie', 'domaine', 'versionActive'])
            ->horsCorbeille();

        if (! empty($filters['q'])) {

            $terme = $filters['q'];

            $query->where(function (Builder $q) use ($terme) {
                $q->where('titre', 'like', "%{$terme}%")
                    ->orWhere('auteur', 'like', "%{$terme}%")
                    ->orWhere('numero_acte', 'like', "%{$terme}%");
            });
        }

        foreach (['categorie_id', 'domaine_id', 'type'] as $colonne) {

            if (! empty($filters[$colonne])) {
                $query->where($colonne, $filters[$colonne]);
            }
        }

        if (! empty($filters['date_from'])) {
            $query->whereRaw(self::DATE_EXPR.' >= ?', [$filters['date_from']]);
        }
        
        if (! empty($filters['date_to'])) {
            $query->whereRaw(self::DATE_EXPR.' <= ?', [$filters['date_to']]);
        }

        match ($filters['sort'] ?? 'date_desc') {
            'date_asc' => $query->orderByRaw(self::DATE_EXPR.' asc'),
            'titre_asc' => $query->orderBy('titre'),
            'titre_desc' => $query->orderByDesc('titre'),
            default => $query->orderByRaw(self::DATE_EXPR.' desc'),
        };

        return $query->orderByDesc('id');
    }

    /** Documents en corbeille (RG-05), les plus récemment supprimés d'abord. */
    public function trashed(User $user): Builder
    {
        return $this->scoped($user)
            ->with(['categorie', 'domaine', 'versionActive'])
            ->where('statut', 'corbeille')
            ->orderByDesc('corbeille_at');
    }

    public function findDuplicate(User $user, string $hash): ?Document {

        return Document::where('user_id', $user->id)
            ->where('hash_sha256', $hash)
            ->horsCorbeille()
            ->first();
    }

    /**
     * Ajoute un document (UC-01) : détection de doublon, version 1 active, journalisation.
     *
     * @throws DuplicateDocumentException
     */
    public function create(User $user, array $data, UploadedFile $file): Document {

        $hash = hash_file('sha256', $file->getRealPath());

        if ($existing = $this->findDuplicate($user, $hash)) {
            throw new DuplicateDocumentException($existing);
        }

        return DB::transaction(function () use ($user, $data, $file, $hash) {
            $document = Document::create([
                ...$data,
                'user_id' => $user->id,
                'hash_sha256' => $hash,
                'statut' => 'publie',
            ]);

            $this->storeVersionFile($document, $file, 1);
            JournalAction::log($user->id, $document->id, 'ajout');

            return $document;
        });
    }

    public function updateMetadata(Document $document, array $data, User $user): Document {

        $document->update($data);
        JournalAction::log($user->id, $document->id, 'mise_a_jour');

        return $document;
    }

    /** Dépose une nouvelle version : l'ancienne est archivée, jamais supprimée (RG-04, UC-02). */
    public function addVersion(Document $document, UploadedFile $file, User $user): DocumentVersion {

        return DB::transaction(function () use ($document, $file, $user) {
            $document->versions()->where('est_active', true)->update(['est_active' => false]);

            $numero = ((int) $document->versions()->max('numero_version')) + 1;
            $version = $this->storeVersionFile($document, $file, $numero);

            $document->update(['hash_sha256' => hash_file('sha256', $file->getRealPath())]);
            JournalAction::log($user->id, $document->id, 'mise_a_jour');

            return $version;
        });
    }

    /** Rend active une version antérieure (EF-11) et réaligne l'empreinte du document. */
    public function activateVersion(Document $document, DocumentVersion $version, User $user): DocumentVersion {

        return DB::transaction(function () use ($document, $version, $user) {
            $document->versions()->where('est_active', true)->update(['est_active' => false]);
            $version->update(['est_active' => true]);

            $path = Storage::disk('local')->path($version->chemin_fichier);
            if (is_file($path)) {
                $document->update(['hash_sha256' => hash_file('sha256', $path)]);
            }

            JournalAction::log($user->id, $document->id, 'mise_a_jour');

            return $version;
        });
    }

    /** Suppression logique (RG-05) : le document passe en corbeille avant toute purge. */
    public function trash(Document $document, User $user): void {

        $document->update(['statut' => 'corbeille', 'corbeille_at' => now()]);
        JournalAction::log($user->id, $document->id, 'suppression');
    }

    public function restore(Document $document, User $user): void {

        $document->update(['statut' => 'publie', 'corbeille_at' => null]);
        JournalAction::log($user->id, $document->id, 'mise_a_jour');
    }

    private function storeVersionFile(Document $document, UploadedFile $file, int $numero): DocumentVersion {

        $chemin = $file->store("documents/{$document->id}", 'local');

        return DocumentVersion::create([
            'document_id' => $document->id,
            'numero_version' => $numero,
            'chemin_fichier' => $chemin,
            'taille' => $file->getSize(),
            'est_active' => true,
            'created_at' => now(),
        ]);
    }
}
