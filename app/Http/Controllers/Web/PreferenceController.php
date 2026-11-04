<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Http\Middleware\SetLocale;
use Illuminate\Http\Request;

// Enregistre le thème et/ou la langue choisis via ThemeSwitch / LanguageSwitch.
// Toujours en session (visiteurs non connectés compris) ; en plus sur le profil si connecté.
class PreferenceController extends Controller
{
    public function update(Request $request) {
        
        $data = $request->validate([
            'theme' => ['sometimes', 'in:clair,sombre,auto'],
            'locale' => ['sometimes', 'in:'.implode(',', SetLocale::LOCALES)],
        ]);

        foreach ($data as $key => $value) {
            session([$key => $value]);
        }

        if ($user = $request->user()) {
            $user->update(['preferences' => array_merge($user->preferences ?? [], $data)]);
        }

        return back();
    }
}
