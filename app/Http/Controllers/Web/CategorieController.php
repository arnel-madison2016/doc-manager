<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Categorie;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;


class CategorieController extends Controller
{
    public function index(Request $request) {

        $categories = Categorie::query()
            ->withCount('documents')
            ->with(['domaines' => fn ($q) => $q->withCount('documents')->orderBy('name')])
            ->orderBy('name')
            ->get()
            ->map(fn (Categorie $c) => [
                'id' => $c->id,
                'name' => $c->name,
                'type' => $c->type,
                'documents_count' => $c->documents_count,
                'domaines' => $c->domaines->map(fn ($d) => [
                    'id' => $d->id,
                    'name' => $d->name,
                    'documents_count' => $d->documents_count,
                ])->values(),
            ])->values();

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'can' => [
                'categories' => $request->user()->can('categories.gerer'),
                'domaines' => $request->user()->can('domaines.gerer'),
            ],
        ]);
    }

    public function store(Request $request) {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories'],
            'type' => ['required', 'in:texte_administratif,livre_personnel,autre'],
        ]);

        Categorie::create($data);

        return back()->with('success', 'Catégorie créée avec succès.');
    }

    public function update(Request $request, Categorie $categorie) {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:categories,name,' . $categorie->id],
            'type' => ['required', 'in:texte_administratif,livre_personnel,autre'],
        ]);

        $categorie->update($data);

        return back()->with('success', 'Catégorie mise à jour.');
    }

    public function destroy(Categorie $categorie) {
        
        if ($categorie->documents()->exists()) {
            return back()->withErrors(['categorie' => 'Impossible de supprimer une catégorie rattachée à des documents.']);
        }

        $categorie->domaines()->delete();
        $categorie->delete();

        return back()->with('success', 'Catégorie supprimée.');
    }
}
