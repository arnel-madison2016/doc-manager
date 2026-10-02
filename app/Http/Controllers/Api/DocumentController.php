<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\JournalAction;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

// Modules "Ajout", "Consultation et recherche", "Téléchargement", "Mise à jour"
// (§4.3 à §4.6 du Cahier des charges ; UC-01/UC-02/UC-03 ; §4 de la Spécification API).
// Les règles de validation sont déclarées directement dans chaque méthode.
//
// Le trait AuthorizesRequests est déclaré ici pour rendre $this->authorize(...)
// disponible même si app/Http/Controllers/Controller.php (squelette Laravel 11+)
// ne le fournit pas déjà. Si vous l'avez également ajouté sur le contrôleur de
// base, cette double déclaration est sans danger (PHP fusionne simplement les
// mêmes méthodes) ; vous pouvez alors retirer l'une des deux déclarations.
class DocumentController extends Controller
{
    use AuthorizesRequests;

    // GET /api/v1/documents — EF-06, EF-07 (§4.2 Spécification API)
    public function index(Request $request) {

        $filtres = $request->validate([
            'q' => ['sometimes', 'nullable', 'string', 'max:255'],
            'categorie_id' => ['sometimes', 'nullable', 'integer', 'exists:categories,id'],
            'domaine_id' => ['sometimes', 'nullable', 'integer', 'exists:domaines,id'],
            'type' => ['sometimes', 'nullable', 'in:texte_administratif,livre_personnel'],
            'date_from' => ['sometimes', 'nullable', 'date'],
            'date_to' => ['sometimes', 'nullable', 'date'],
            'sort' => ['sometimes', 'nullable', 'in:date_asc,date_desc,titre_asc,titre_desc'],
            'page' => ['sometimes', 'nullable', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'nullable', 'integer', 'min:1', 'max:100'],
        ]);

        $user = $request->user();

        $query = Document::query()
            ->with(['categorie', 'domaine', 'versionActive'])
            ->horsCorbeille()
            ->when(! $user->isAdmin(), fn ($q) => $q->where('user_id', $user->id));

        $query->when(! empty($filtres['q']), function ($q) use ($filtres) {
            $terme = $filtres['q'];
            $q->where(function ($sub) use ($terme) {
                $sub->where('titre', 'like', "%{$terme}%")
                    ->orWhere('auteur', 'like', "%{$terme}%")
                    ->orWhere('numero_acte', 'like', "%{$terme}%");
            });
        });

        $query->when(! empty($filtres['categorie_id']), fn ($q) => $q->where('categorie_id', $filtres['categorie_id']));
        $query->when(! empty($filtres['domaine_id']), fn ($q) => $q->where('domaine_id', $filtres['domaine_id']));
        $query->when(! empty($filtres['type']), fn ($q) => $q->where('type', $filtres['type']));
        $query->when(! empty($filtres['date_from']), fn ($q) => $q->whereDate('created_at', '>=', $filtres['date_from']));
        $query->when(! empty($filtres['date_to']), fn ($q) => $q->whereDate('created_at', '<=', $filtres['date_to']));

        $query->orderBy(...match ($filtres['sort'] ?? null) {
            'date_asc' => ['created_at', 'asc'],
            'titre_asc' => ['titre', 'asc'],
            'titre_desc' => ['titre', 'desc'],
            default => ['created_at', 'desc'], // date_desc par défaut
        });

        $perPage = (int) ($filtres['per_page'] ?? 20);
        $documents = $query->paginate(min($perPage, 100));

        return response()->json([
            'data' => $documents->items(),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
                'last_page' => $documents->lastPage(),
            ],
        ]);
    }

    // POST /api/v1/documents — UC-01, EF-04, EF-05
    public function store(Request $request) {

        $data = $request->validate([
            // Import PDF exclusivement, type MIME réel vérifié en plus de l'extension
            // (contrainte technique §10.1 Cahier des charges, sécurité §8).
            'fichier' => ['required', 'file', 'mimetypes:application/pdf', 'mimes:pdf', 'max:51200'],

            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'categorie_id' => ['required', 'integer', 'exists:categories,id'],
            'domaine_id' => ['nullable', 'integer', 'exists:domaines,id'],
            'type' => ['required', 'in:texte_administratif,livre_personnel,autre'],

            // Champs spécifiques TexteAdministratif (RG-08 : le type ne change plus après création)
            'numero_acte' => ['required_if:type,texte_administratif', 'nullable', 'string', 'max:100'],
            'type_acte' => ['required_if:type,texte_administratif', 'nullable', 'in:loi, ordonnance,decret,arrete,decision, circulaire'],
            'autorite_emettrice' => ['required_if:type,texte_administratif', 'nullable', 'string', 'max:255'],
            'date_signature' => ['required_if:type,texte_administratif', 'nullable', 'date'],

            // Champs spécifiques LivrePersonnel
            'auteur' => ['required_if:type,livre_personnel', 'nullable', 'string', 'max:255'],
            'editeur' => ['nullable', 'string', 'max:255'],
            'isbn' => ['nullable', 'string', 'max:20'],
        ]);

        $user = $request->user();
        $fichier = $data['fichier'];
        $hash = hash_file('sha256', $fichier->getRealPath());

        // EF-05 : détection de doublon (même empreinte, pour l'utilisateur courant).
        $existing = Document::where('user_id', $user->id)
            ->where('hash_sha256', $hash)
            ->horsCorbeille()
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Un document identique existe déjà.',
                'existing_document_id' => $existing->id,
            ], 409);
        }

        $document = Document::create([
            ...Arr::except($data, 'fichier'),
            'user_id' => $user->id,
            'hash_sha256' => $hash,
            'statut' => 'publie',
        ]);

        $chemin = $fichier->store("documents/{$document->id}", 'local');

        $version = DocumentVersion::create([
            'document_id' => $document->id,
            'numero_version' => 1,
            'chemin_fichier' => $chemin,
            'taille' => $fichier->getSize(),
            'est_active' => true,
            'created_at' => now(),
        ]);

        JournalAction::log($user->id, $document->id, 'ajout');

        return response()->json([
            'id' => $document->id,
            'titre' => $document->titre,
            'type' => $document->type,
            'statut' => $document->statut,
            'hash_sha256' => $document->hash_sha256,
            'version_active' => $version->numero_version,
            'created_at' => $document->created_at,
        ], 201);
    }

    // GET /api/v1/documents/{id}
    public function show(Request $request, Document $document) {

        $this->authorize('view', $document);

        JournalAction::log($request->user()->id, $document->id, 'consultation');

        return response()->json($document->load(['categorie', 'domaine', 'versionActive']));
    }

    // PUT /api/v1/documents/{id} — mise à jour des métadonnées uniquement (RG-08)
    public function update(Request $request, Document $document) {

        $this->authorize('update', $document);

        $data = $request->validate([
            'titre' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['sometimes', 'nullable', 'string'],
            'categorie_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'domaine_id' => ['sometimes', 'nullable', 'integer', 'exists:domaines,id'],

            'numero_acte' => ['sometimes', 'nullable', 'string', 'max:100'],
            'type_acte' => ['sometimes', 'nullable', 'in:loi,ordonnance,decret,arrete,decision,circulaire'],
            'autorite_emettrice' => ['sometimes', 'nullable', 'string', 'max:255'],
            'date_signature' => ['sometimes', 'nullable', 'date'],

            'auteur' => ['sometimes', 'nullable', 'string', 'max:255'],
            'editeur' => ['sometimes', 'nullable', 'string', 'max:255'],
            'isbn' => ['sometimes', 'nullable', 'string', 'max:20'],
        ]);

        $document->update($data);

        JournalAction::log($request->user()->id, $document->id, 'mise_a_jour');

        return response()->json($document);
    }

    // DELETE /api/v1/documents/{id} — suppression logique (RG-05)
    public function destroy(Request $request, Document $document) {

        $this->authorize('delete', $document);

        $document->update([
            'statut' => 'corbeille',
            'corbeille_at' => now(),
        ]);

        JournalAction::log($request->user()->id, $document->id, 'suppression');

        return response()->json(null, 204);
    }

    // POST /api/v1/documents/{id}/restore — restauration depuis la corbeille
    public function restore(Request $request, Document $document) {

        $this->authorize('restore', $document);

        $document->update([
            'statut' => 'publie',
            'corbeille_at' => null,
        ]);

        return response()->json($document);
    }

    // GET /api/v1/documents/{id}/preview — UC-03, lecture en flux (inline)
    public function preview(Request $request, Document $document) {

        $this->authorize('view', $document);

        $version = $document->versionActive()->firstOrFail();

        JournalAction::log($request->user()->id, $document->id, 'consultation');

        // response()->file() est défini par le contrat Illuminate\Contracts\Routing\
        // ResponseFactory : contrairement à Storage::disk()->response(), il est bien
        // résolu par l'analyse statique de l'IDE. On lui passe le chemin absolu du
        // fichier (disque local) obtenu via Storage::disk('local')->path(...).
        return response()->file(
            Storage::disk('local')->path($version->chemin_fichier),
            [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="'.$document->titre.'.pdf"',
            ]
        );
    }

    // GET /api/v1/documents/{id}/download — EF-08
    public function download(Request $request, Document $document) {

        $this->authorize('view', $document);

        $version = $document->versionActive()->firstOrFail();

        JournalAction::log($request->user()->id, $document->id, 'telechargement');

        // Même principe : response()->download() (ResponseFactory) plutôt que la
        // méthode download() propre à FilesystemAdapter, absente du contrat Filesystem.
        return response()->download(
            Storage::disk('local')->path($version->chemin_fichier),
            $document->titre.'.pdf'
        );
    }

    // POST /api/v1/documents/{id}/versions — UC-02, EF-10
    public function storeVersion(Request $request, Document $document) {

        $this->authorize('update', $document);

        $data = $request->validate([
            'fichier' => ['required', 'file', 'mimetypes:application/pdf', 'mimes:pdf', 'max:51200'],
        ]);

        $fichier = $data['fichier'];

        // RG-04 : la version précédente est conservée, jamais supprimée.
        $document->versions()->where('est_active', true)->update(['est_active' => false]);

        $prochainNumero = ($document->versions()->max('numero_version') ?? 0) + 1;
        $chemin = $fichier->store("documents/{$document->id}", 'local');

        $version = DocumentVersion::create([
            'document_id' => $document->id,
            'numero_version' => $prochainNumero,
            'chemin_fichier' => $chemin,
            'taille' => $fichier->getSize(),
            'est_active' => true,
            'created_at' => now(),
        ]);

        // L'empreinte de la version active devient celle du document (détection de doublon).
        $document->update(['hash_sha256' => hash_file('sha256', $fichier->getRealPath())]);

        JournalAction::log($request->user()->id, $document->id, 'mise_a_jour');

        return response()->json([
            'id' => $document->id,
            'version_active' => $version->numero_version,
            'versions' => $document->versions()->get(['numero_version', 'est_active', 'created_at']),
        ]);
    }

    // GET /api/v1/documents/{id}/versions
    public function indexVersions(Request $request, Document $document) {

        $this->authorize('view', $document);

        return response()->json(['data' => $document->versions()->get()]);
    }

    // POST /api/v1/documents/{id}/versions/{versionId}/restore — EF-11
    public function restoreVersion(Request $request, Document $document, DocumentVersion $version) {
        
        $this->authorize('update', $document);

        abort_unless($version->document_id === $document->id, 404);

        $document->versions()->where('est_active', true)->update(['est_active' => false]);
        $version->update(['est_active' => true]);

        JournalAction::log($request->user()->id, $document->id, 'mise_a_jour');

        return response()->json($version);
    }
}