<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Arr;

// Props partagées avec toutes les pages Inertia (Dossier frontend §2.3).
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string {

        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array {
        
        $user = $request->user();
        $settings = AppSetting::allCached();
        $forced   = (bool) $settings['theme_forcer'];

        return array_merge(parent::share($request), [
            //'auth' => [
            //    'user' => $user ? $user->toApiArray() : null,
            //    'permissions' => $user ? $user->getAllPermissions()->pluck('name')->values() : [],                
            //],
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar_path' => $request->user()->avatar_path,
                    'preferences' => $request->user()->preferences,
                    'roles' => $request->user()->getRoleNames(),
                    'permissions' => $user->getAllPermissions()->pluck('name'),
                    //'permissions' => $request->user()->getAllPermissions()->pluck('name'),
                ] : null,
            ],
            // null tant qu'aucune préférence n'a été enregistrée : le client retombe alors sur
            // son cache local (localStorage) puis sur la détection navigateur / "auto".
            'preferences' => [
                'theme'  => $forced ? $settings['theme_defaut'] : data_get($user, 'preferences.theme', session('theme')),
                'locale' => data_get($user, 'preferences.locale', session('locale')),
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message'),
                'type' => fn () => $request->session()->get('type', 'success'),
            ],
            'app' => [
                'name' => config('app.name'),
                'locales' => ['langues_disponibles'],
                'settings' => Arr::only($settings, ['theme_defaut', 'theme_forcer', 'langue_defaut',
                'vue_documents_defaut', 'lignes_par_page_defaut', 'upload_taille_max_mo', 'inscription_ouverte']),
                'maintenance' => [
                    'actif'   => (bool) $settings['maintenance_actif'],
                    'message' => data_get($settings, 'maintenance_message.'.app()->getLocale()),
                ],
            ],
        ]);
    }
}
