<?php

namespace App\Http\Middleware;

use App\Models\AppSetting;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */

    public function handle(Request $request, Closure $next): Response {
       
        $locale = data_get($request->user(), 'preferences.locale', session('locale'))
                  ?? AppSetting::read('fr');

        // Récupération sécurisée des langues disponibles sous forme de tableau
        $disponibles = AppSetting::read('langues_disponibles', ['fr', 'en']);
        if (is_string($disponibles)) {
            $disponibles = json_decode($disponibles, true) ?? ['fr', 'en'];
        }

        if (is_string($locale) && in_array($locale, $disponibles, true)) {
            app()->setLocale($locale);
        } else {
            app()->setLocale(config('app.fallback_locale', 'fr'));
        }

        return $next($request);
    }
}
