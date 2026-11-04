<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class SettingsController extends Controller
{
    public function publicSettings() {

        $settings = AppSetting::allCached();

        return response()->json([
            'name' => $settings['nom_application'],
            'logo_url' => $settings['logo_path'] ? asset('storage/' . $settings['logo_path']) : null,
            'default_theme' => $settings['theme_defaut'],
            'primary_color' => $settings['couleur_primaire'],
            'default_locale' => $settings['langue_defaut'],
            'available_locales' => $settings['langues_disponibles'],
            'registration_open' => (bool) $settings['inscription_ouverte'],
            'maintenance' => [
                'active' => (bool) $settings['maintenance_actif'],
                'message' => data_get($settings, 'maintenance_message.' . app()->getLocale()),
            ],
        ]);
    }

    public function show() {
        
        return response()->json(AppSetting::allCached());
    }

    public function update(Request $request) {

        $data = $request->validate([
            'nom_application' => ['sometimes', 'string', 'max:60'],
            'theme_defaut' => ['sometimes', 'in:clair,sombre,auto'],
            'langue_defaut' => ['sometimes', 'string'],
            'langues_disponibles' => ['sometimes', 'array'],
            'inscription_ouverte' => ['sometimes', 'boolean'],
        ]);

        foreach ($data as $key => $value) {
            AppSetting::write($key, $value);
        }

        return response()->json([
            'message' => 'Paramètres mis à jour avec succès.',
            'settings' => AppSetting::allCached(),
        ]);
    }
}
