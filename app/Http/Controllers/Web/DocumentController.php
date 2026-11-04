<?php

namespace App\Http\Controllers\Web;

use App\Exceptions\DuplicateDocumentException;
use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Models\Categorie;
use App\Models\Document;
use App\Models\DocumentVersion;
use App\Models\JournalAction;
use App\Services\DocumentService;
use App\Support\DocumentPresenter;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

// Module documents du client web (UC-01, UC-02, UC-03). La logique métier est dans DocumentService,
// partagée avec l'API mobile ; ici : validation (inline), autorisation (DocumentPolicy) et réponses Inertia.
class DocumentController extends Controller
{
    public function __construct(private DocumentService $documents) {}

    // GET /documents — recherche multicritère (EF-06, EF-07)
    public function index(Request $request) {

        $filters = $request->validate([
            'q' => ['nullable', 'string', 'max:255'],
            'categorie_id' => ['nullable', 'integer', 'exists:categories,id'],
            'domaine_id' => ['nullable', 'integer', 'exists:domaines,id'],
            'type' => ['nullable', Rule::in(array_keys(DocumentService::TYPE_TO_CATEGORIE))],
            'date_from' => ['nullable', 'date'],
            'date_to' => ['nullable', 'date'],
            'sort' => ['nullable', 'in:date_asc,date_desc,titre_asc,titre_desc'],
            'per_page' => ['nullable', 'integer', 'in:10,20,50,100'],
        ]);

        $user = $request->user();

        $perPage = (int) ($filters['per_page']
            ?? $user->preference('per_page')
            ?? AppSetting::read('lignes_par_page_defaut', 20));

        // VÉRIFIEZ CETTE LIGNE : 
        // Si DocumentService::search() retourne déjà une collection paginée, 
        // appeler .paginate($perPage) ici provoquerait l'erreur "Undefined method paginate".
        $documents = $this->documents->search($user, $filters)
            ->paginate($perPage) // Transforme le Builder en Paginator ici
            ->withQueryString()
            ->through(function (Document $d) {
                $array = DocumentPresenter::toArray($d);
                $versionActive = $d->versionActive;

                return array_merge($array, [
                    'version_active' => $versionActive?->numero_version ?? $versionActive?->numero_version ?? null,
                    'est_active' => $versionActive?->est_active ?? $versionActive?->est_active ?? 0,
                    'taille' => $versionActive?->taille ?? $d->taille ?? null,
                ]);
            });

        return Inertia::render('Documents/Index', [
            'documents' => $documents,
            'filters' => Arr::only($filters, ['q', 'type', 'categorie_id', 'domaine_id', 'date_from', 'date_to', 'sort']),
            'categories' => Categorie::with('domaines')->get(), // Remplacé ici
        ]);
    }

    // GET /documents/create
    public function create(Request $request) {

        $type = $request->query('type');

        return Inertia::render('Documents/Create', [
            'categories' => Categorie::with('domaines')->get(), // Remplacé ici
            'maxUploadMb' => (int) AppSetting::read('upload_taille_max_mo', 50),
            'initialType' => array_key_exists($type, DocumentService::TYPE_TO_CATEGORIE) ? $type : 'texte_administratif',
        ]);
    }

    // POST /documents — UC-01, EF-04, EF-05
    public function store(Request $request) {
        
        $type = $request->validate([
            'type' => ['required', Rule::in(array_keys(DocumentService::TYPE_TO_CATEGORIE))],
        ])['type'];

        $data = $request->validate(array_merge(
            $this->metadataRules($request, $type),
            ['fichier' => $this->documents->fileRules()],
        ));

        try {
            $document = $this->documents->create(
                $request->user(),
                $this->normalize($type, Arr::except($data, 'fichier') + ['type' => $type]),
                $request->file('fichier'),
            );
        } catch (DuplicateDocumentException $e) {
            // Doublon (EF-05) : retour au formulaire avec de quoi afficher le lien vers le document existant.
            return back()->withErrors([
                'fichier' => trans('documents.duplicate'),
                'duplicate_of' => (string) $e->existing->id,
                'duplicate_titre' => $e->existing->titre,
            ]);
        }

        return redirect()->route('documents.show', $document)
            ->with(['message' => trans('documents.flash.created'), 'type' => 'success']);
    }

    // GET /documents/{document}
    public function show(Document $document) {

        Gate::authorize('view', $document);
        $document->load(['categorie', 'domaine', 'versionActive', 'versions']);

        return Inertia::render('Documents/Show', [
            'document' => DocumentPresenter::toArray($document),
            'versions' => $document->versions->map(fn ($v) => DocumentPresenter::version($v))->values(),
            'can' => [
                'update' => Gate::allows('update', $document),
                'delete' => Gate::allows('delete', $document),
                'restore' => Gate::allows('restore', $document),
            ],
            'retentionDays' => (int) AppSetting::read('corbeille_retention_jours', 30),
        ]);
    }

    // GET /documents/{document}/edit
    public function edit(Document $document) {

        Gate::authorize('update', $document);
        $document->load(['categorie', 'domaine', 'versionActive']);

        return Inertia::render('Documents/Edit', [
            'document' => DocumentPresenter::toArray($document),
            'categories' => DocumentPresenter::categoriesTree(),
        ]);
    }

    // PUT /documents/{document} — métadonnées uniquement ; le type est immuable (RG-08)
    public function update(Request $request, Document $document) {

        Gate::authorize('update', $document);

        $data = $request->validate($this->metadataRules($request, $document->type));
        $this->documents->updateMetadata($document, $this->normalize($document->type, $data), $request->user());

        return redirect()->route('documents.show', $document)
            ->with(['message' => trans('documents.flash.updated'), 'type' => 'success']);
    }

    // DELETE /documents/{document} — mise en corbeille (RG-05)
    public function destroy(Request $request, Document $document)
    {
        Gate::authorize('delete', $document);
        $this->documents->trash($document, $request->user());

        return redirect()->route('documents.index')
            ->with(['message' => trans('documents.flash.trashed'), 'type' => 'success']);
    }

    // POST /documents/{document}/restore
    public function restore(Request $request, Document $document)
    {
        Gate::authorize('restore', $document);
        $this->documents->restore($document, $request->user());

        return redirect()->route('documents.show', $document)
            ->with(['message' => trans('documents.flash.restored'), 'type' => 'success']);
    }

    // GET /documents/corbeille
    public function trash(Request $request)
    {
        $retention = (int) AppSetting::read('corbeille_retention_jours', 30);

        $documents = $this->documents->trashed($request->user())
            ->paginate(20)
            ->withQueryString()
            ->through(function (Document $d) use ($retention) {
                $ecoules = $d->corbeille_at ? (int) floor(abs($d->corbeille_at->diffInDays(now()))) : 0;

                return DocumentPresenter::toArray($d) + ['purge_in_days' => max(0, $retention - $ecoules)];
            });

        return Inertia::render('Documents/Trash', [
            'documents' => $documents,
            'retentionDays' => $retention,
        ]);
    }

    // GET /documents/{document}/preview[?version=ID] — flux PDF en ligne (UC-03)
    public function preview(Request $request, Document $document)
    {
        Gate::authorize('view', $document);
        $version = $this->resolveVersion($request, $document);
        JournalAction::log($request->user()->id, $document->id, 'consultation');

        return response()->file($this->pathOf($version), [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline; filename="'.$this->filename($document, $version).'"',
            'X-Content-Type-Options' => 'nosniff',
        ]);
    }

    // GET /documents/{document}/download[?version=ID] — EF-08
    public function download(Request $request, Document $document)
    {
        Gate::authorize('view', $document);
        $version = $this->resolveVersion($request, $document);
        JournalAction::log($request->user()->id, $document->id, 'telechargement');

        return response()->download($this->pathOf($version), $this->filename($document, $version), [
            'Content-Type' => 'application/pdf',
        ]);
    }

    // GET /documents/{document}/versions
    public function versions(Document $document)
    {
        Gate::authorize('view', $document);
        $document->load('versions');

        return Inertia::render('Documents/Versions', [
            'document' => [
                'id' => $document->id,
                'titre' => $document->titre,
                'type' => $document->type,
                'statut' => $document->statut,
            ],
            'versions' => $document->versions->map(fn ($v) => DocumentPresenter::version($v))->values(),
            'can' => ['update' => Gate::allows('update', $document)],
            'maxUploadMb' => (int) AppSetting::read('upload_taille_max_mo', 50),
        ]);
    }

    // POST /documents/{document}/versions — UC-02, EF-10
    public function storeVersion(Request $request, Document $document)
    {
        Gate::authorize('update', $document);

        $request->validate(['fichier' => $this->documents->fileRules()]);
        $version = $this->documents->addVersion($document, $request->file('fichier'), $request->user());

        return redirect()->route('documents.versions.index', $document)
            ->with(['message' => trans('documents.flash.version_added', ['n' => $version->numero_version]), 'type' => 'success']);
    }

    // POST /documents/{document}/versions/{version}/restore — EF-11
    public function restoreVersion(Request $request, Document $document, DocumentVersion $version)
    {
        Gate::authorize('update', $document);
        abort_unless($version->document_id === $document->id, 404);

        $this->documents->activateVersion($document, $version, $request->user());

        return back()->with([
            'message' => trans('documents.flash.version_restored', ['n' => $version->numero_version]),
            'type' => 'success',
        ]);
    }

    /** Règles des métadonnées, conditionnelles au type du document (RG-08). */
    private function metadataRules(Request $request, string $type): array {
        
        $acte = $type === 'texte_administratif';

        return [
            'titre' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            // La catégorie doit être de la nature correspondant au type ; le domaine, dépendre de la catégorie.
            'categorie_id' => ['required', 'integer',
                Rule::exists('categories', 'id')->where('type', DocumentService::TYPE_TO_CATEGORIE[$type])],
            'domaine_id' => ['nullable', 'integer',
                Rule::exists('domaines', 'id')->where('categorie_id', $request->input('categorie_id'))],
            'numero_acte' => [$acte ? 'required' : 'nullable', 'string', 'max:100'],
            'type_acte' => [$acte ? 'required' : 'nullable', Rule::in(['decret', 'arrete', 'decision'])],
            'autorite_emettrice' => [$acte ? 'required' : 'nullable', 'string', 'max:255'],
            'date_signature' => [$acte ? 'required' : 'nullable', 'date'],
            'auteur' => [$acte ? 'nullable' : 'required', 'string', 'max:255'],
            'editeur' => ['nullable', 'string', 'max:255'],
            'isbn' => ['nullable', 'string', 'max:20'],
        ];
    }

    /** Met à null les champs de l'autre type, pour ne pas conserver de métadonnées incohérentes. */
    private function normalize(string $type, array $data): array
    {
        $inutiles = $type === 'texte_administratif'
            ? ['auteur', 'editeur', 'isbn']
            : ['numero_acte', 'type_acte', 'autorite_emettrice', 'date_signature'];

        foreach ($inutiles as $champ) {
            $data[$champ] = null;
        }

        return $data;
    }

    private function resolveVersion(Request $request, Document $document): DocumentVersion
    {
        $id = $request->query('version');

        return $id
            ? $document->versions()->whereKey($id)->firstOrFail()
            : $document->versionActive()->firstOrFail();
    }

    private function pathOf(DocumentVersion $version): string
    {
        $path = Storage::disk('local')->path($version->chemin_fichier);
        abort_unless(is_file($path), 404);

        return $path;
    }

    private function filename(Document $document, DocumentVersion $version): string
    {
        $base = Str::slug($document->titre, '_') ?: 'document';

        return $base.($version->est_active ? '' : '_v'.$version->numero_version).'.pdf';
    }
}