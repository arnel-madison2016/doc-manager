<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function edit(Request $request) {

        return Inertia::render('Settings/Edit', [
            'preferences' => $request->user()->preferences ?? [],
        ]);
    }

    public function update(Request $request) {
        
        $data = $request->validate([
            'theme' => ['required', 'in:clair,sombre,auto'],
            'locale' => ['required', 'in:fr,en'],
            'per_page' => ['required', 'integer', 'in:10,20,50,100'],
            'vue_documents' => ['required', 'in:tableau,cartes'],
        ]);

        $request->user()->update(['preferences' => $data]);

        return back()->with('success', 'Préférences enregistrées.');
    }
}
