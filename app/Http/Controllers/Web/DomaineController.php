<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Domaine;
use Illuminate\Http\Request;

class DomaineController extends Controller
{
    public function store(Request $request) {

        $data = $request->validate([
            'categorie_id' => ['required', 'exists:categories,id'],
            'name' => ['required', 'string', 'max:255'],
        ]);

        Domaine::create($data);

        return back()->with('success', 'Domaine créé avec succès.');
    }

    public function update(Request $request, Domaine $domaine) {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $domaine->update($data);

        return back()->with('success', 'Domaine mis à jour.');
    }

    public function destroy(Domaine $domaine) {
        
        if ($domaine->documents()->exists()) {
            return back()->withErrors(['domaine' => 'Impossible de supprimer un domaine contenant des documents.']);
        }

        $domaine->delete();

        return back()->with('success', 'Domaine supprimé.');
    }
}
