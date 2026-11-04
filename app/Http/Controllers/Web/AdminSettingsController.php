<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminSettingsController extends Controller
{
    public function edit() {

        return Inertia::render('Admin/Settings', [
            'settings' => AppSetting::allCached(),
        ]);
    }

    public function update(Request $request) {

        $section = $request->input('section');

        $rules = match ($section) {
            'apparence' => [
                'theme_defaut' => ['required', 'in:clair,sombre,auto'],
                'theme_forcer' => ['required', 'boolean'],
                'couleur_primaire' => ['required', 'in:' . implode(',', array_keys(config('gedoc.palettes')))],
                'nom_application' => ['required', 'string', 'max:60'],
            ],
            'langue' => [
                'langue_defaut' => ['required', 'string'],
                'langues_disponibles' => ['required', 'array', 'min:1'],
            ],
            'documents' => [
                'corbeille_retention_jours' => ['required', 'integer', 'between:1,365'],
                'upload_taille_max_mo' => ['required', 'integer', 'between:1,200'],
                'vue_documents_defaut' => ['required', 'in:tableau,cartes'],
                'lignes_par_page_defaut' => ['required', 'integer', 'in:10,20,50,100'],
            ],
            'securite' => [
                'inscription_ouverte' => ['required', 'boolean'],
                'journal_retention_jours' => ['required', 'integer', 'between:30,1825'],
                'maintenance_actif' => ['required', 'boolean'],
                'maintenance_message' => ['nullable', 'array'],
            ],
            default => [],
        };

        $data = $request->validate($rules);

        foreach ($data as $key => $value) {
            AppSetting::write($key, $value);
        }

        return back()->with('success', 'Paramètres mis à jour avec succès.');
    }

    public function uploadLogo(Request $request) {

        $request->validate([
            'logo' => ['required', 'image', 'mimes:png,jpg,jpeg,svg,webp', 'max:1024'],
        ]);

        $current = AppSetting::read('logo_path');

        if ($current) {
            Storage::disk('public')->delete($current);
        }

        $path = $request->file('logo')->store('logos', 'public');
        AppSetting::write('logo_path', $path);

        return back()->with('success', 'Logo mis à jour.');
    }

    public function destroyLogo() {

        $current = AppSetting::read('logo_path');
        
        if ($current) {
            Storage::disk('public')->delete($current);
            AppSetting::write('logo_path', null);
        }

        return back()->with('success', 'Logo supprimé.');
    }
}
