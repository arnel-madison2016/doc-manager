<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

// Module "Gestion des catégories et classification documentaire" — §4.2 du Cahier
// des charges, §3 de la Spécification API. Écriture réservée à l'administrateur :
// l'autorisation n'est plus vérifiée ici mais par le middleware
// `permission:categories.gerer` appliqué aux routes concernées (routes/api.php),
// porté par le rôle "administrateur" via spatie/laravel-permission.
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

        $data = $request->validate([
            'name' => ['required', 'string', 'max:100', 'unique:categories,name'],
            'type' => ['required', 'in:administratif,personnel'],
        ]);

        $categorie = Categorie::create($data);

        return response()->json($categorie, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id) {

        //
    }

    /**
     * Update the specified resource in storage.
     */
    // PUT /api/v1/categories/{categorie}
    public function update(Request $request, Categorie $categorie) {

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
            'data' => $categorie->domaines()->orderBy('libelle')->get(),
        ]);
    }
}
