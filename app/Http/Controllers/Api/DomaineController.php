<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Domaine;
use Illuminate\Http\Request;

// §4.2 du Cahier des charges, §3 de la Spécification API. Écriture réservée à
// l'administrateur via le middleware `permission:domaines.gerer` (routes/api.php),
// porté par le rôle "administrateur" via spatie/laravel-permission.
// Les règles de validation sont déclarées directement dans chaque méthode.
class DomaineController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index() {

        //
    }

    /**
     * Store a newly created resource in storage.
     */
    // POST /api/v1/domaines
    public function store(Request $request)  {

        $data = $request->validate([
            'categorie_id' => ['required', 'integer', 'exists:categories,id'],
            'libelle' => ['required', 'string', 'max:150'],
        ]);

        $domaine = Domaine::create($data);

        return response()->json($domaine, 201);
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
    // PUT /api/v1/domaines/{domaine}
    public function update(Request $request, Domaine $domaine) {

        $data = $request->validate([
            'categorie_id' => ['sometimes', 'required', 'integer', 'exists:categories,id'],
            'name' => ['sometimes', 'required', 'string', 'max:150'],
        ]);

        $domaine->update($data);

        return response()->json($domaine);
    }

    /**
     * Remove the specified resource from storage.
     */
    // DELETE /api/v1/domaines/{domaine}
    public function destroy(Request $request, Domaine $domaine) {

        if ($domaine->documents()->exists()) {
            return response()->json([
                'message' => 'Impossible de supprimer un domaine contenant des documents.',
            ], 422);
        }

        $domaine->delete();

        return response()->json(null, 204);
    }
}
