<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// Module "Gestion des catégories et classification documentaire" — §4.2 du Cahier
// des charges, §3 de la Spécification API. Écriture réservée à l'administrateur.
// Les règles de validation sont déclarées directement dans chaque méthode.
class CategorieController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {

        return response()->json([
            'data' => Categorie::with('domaines')->orderBy('name')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    // POST /api/v1/categories
    public function store(Request $request) {

        $this->authorizeAdmin($request);

        $data = $request->validate([
            'nom' => ['required', 'string', 'max:100', 'unique:categories,nom'],
            'type' => ['required', 'in:administratif,personnel,autre'],
        ]);

        $categorie = Categorie::create($data);

        return response()->json($categorie, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    // PUT /api/v1/categories/{categorie}
    public function update(Request $request, Categorie $categorie) {

        $this->authorizeAdmin($request);

        $data = $request->validate([
            'nom' => [
                'sometimes', 'required', 'string', 'max:100',
                Rule::unique('categories', 'nom')->ignore($categorie->id),
            ],
            'type' => ['sometimes', 'required', 'in:administratif,personnel'],
        ]);

        $categorie->update($data);

        return response()->json($categorie);
    }

    /**
     * Remove the specified resource from storage.
     */
    // DELETE /api/v1/categories/{categorie}
    public function destroy(Request $request, Categorie $categorie) {

        $this->authorizeAdmin($request);

        // Suppression bloquée si des documents y sont encore rattachés.
        if ($categorie->documents()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer une catégorie contenant des documents.',
            ], 422);
        }

        $categorie->delete();

        return response()->json(null, 204);
    }

    // GET /api/v1/categories/{categorie}/domaines
    public function domaines(Categorie $categorie) {

        return response()->json([
            'data' => $categorie->domaines()->orderBy('name')->get(),
        ]);
    }

    private function authorizeAdmin(Request $request): void {
        
        abort_unless($request->user()->isAdmin(), 403, 'Action réservée à l\'administrateur.');
    }
}
