<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\JournalAction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

// Module "Gestion des profils utilisateurs" — §4.1 du Cahier des charges,
// §2 de la Spécification API. Deux modes d'authentification Sanctum cohabitent
// (RG-07, §1.3 Spécification API) :
//  - mode SPA (client web React/Inertia) : cookie de session, après appel préalable
//    à GET /sanctum/csrf-cookie côté client (fourni nativement par Sanctum) ;
//  - mode API token (client mobile) : jeton personnel renvoyé dans la réponse.
class AuthController extends Controller
{
    // POST /api/v1/register — EF-01
    public function register(Request $request) {
        
        $data = $request->validate([
            'nom' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->numbers()],
        ]);

        $user = User::create([
            'nom' => $data['nom'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        return response()->json([
            'user' => $user->only('id', 'nom', 'email', 'role'),
        ], 201);
    }

    // POST /api/v1/login — §2.2 Spécification API
    public function login(Request $request)  {

        $data = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            // Absent ou libre : nom d'appareil transmis par le client mobile,
            // utilisé pour distinguer le mode token du mode cookie SPA.
            'device_name' => ['sometimes', 'string', 'max:255'],
        ]);

        // identifiants incorrects
        if (! Auth::attempt(['email' => $data['email'], 'password' => $data['password']])) {

            throw ValidationException::withMessages([
                'email' => ['Ces identifiants ne correspondent pas à nos enregistrements.'],
            ]);
        }

        /** @var User $user */
        $user = Auth::user();

        JournalAction::log($user->id, null, 'connexion');

        // Client mobile : émission d'un jeton d'API personnel Sanctum (RG-07).
        if (! empty($data['device_name'])) {

            $token = $user->createToken($data['device_name']);

            return response()->json([
                'user' => $user->only('id', 'nom', 'email', 'role'),
                'token' => $token->plainTextToken,
                'token_type' => 'Bearer',
            ]);
        }

        // Client web SPA : authentification déjà établie par cookie de session
        // (EnsureFrontendRequestsAreStateful) ; on régénère la session par sécurité.
        $request->session()->regenerate();

        return response()->json([
            'user' => $user->only('id', 'nom', 'email', 'role'),
        ]);
    }

    // POST /api/v1/logout
    public function logout(Request $request) {
        
        $user = $request->user();

        if ($token = $user->currentAccessToken()) {

            // Révocation du jeton courant uniquement (connexions multi-appareils, RG-07).
            $token->delete();
        } else {

            Auth::guard('web')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json(null, 204);
    }

    // POST /api/v1/forgot-password
    public function forgotPassword(Request $request) {

        $status = Password::sendResetLink($request->only('email'));

        if ($status !== Password::RESET_LINK_SENT) {

            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['message' => __($status)]);
    }

    // POST /api/v1/reset-password
    public function resetPassword(Request $request) {

       $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->numbers()],
        ]);

        $status = Password::reset(
            $data,
            function (User $user, string $password) {
                $user->forceFill(['password' => Hash::make($password)])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {

            throw ValidationException::withMessages([
                'email' => [__($status)],
            ]);
        }

        return response()->json(['message' => __($status)]);
    }

    // GET /api/v1/me
    public function me(Request $request) {

        return response()->json($request->user()->only('id', 'nom', 'email', 'role'));
    }

    // PUT /api/v1/me/password
    public function updateProfile(Request $request) {

        $data = $request->validate([
            'nom' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes', 'required', 'string', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($request->user()->id),
            ],
        ]);

        $request->user()->update($data);

        return response()->json($request->user()->only('id', 'nom', 'email', 'role'));
    }

    // PUT /api/v1/me/password
    public function updatePassword(Request $request) {

        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->numbers()],
        ]);

        $user = $request->user();

        if (! Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Le mot de passe actuel est incorrect.'],
            ]);
        }

        $user->update(['password' => Hash::make($data['password'])]);

        return response()->json(['message' => 'Mot de passe mis à jour.']);
    }
}