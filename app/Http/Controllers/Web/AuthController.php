<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\JournalAction;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

// Authentification du client web (session par cookie). Les routes /api/v1/* restent
// réservées au client mobile (jeton Bearer) — cf. Dossier frontend §2.1 et §2.2.
class AuthController extends Controller
{
    public function showLogin() {

        return Inertia::render('Auth/Login');
    }

    public function login(Request $request) {

        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages(['email' => trans('auth.failed')]);
        }

        $request->session()->regenerate();
        JournalAction::log(Auth::id(), null, 'connexion'); // RG-06

        return redirect()->intended(route('dashboard'));
    }

    public function showRegister() {

        return Inertia::render('Auth/Register');
    }

    public function register(Request $request) {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->numbers()],
        ]);

        $user = User::create($data); // mot de passe haché par le cast "hashed" du modèle
        $user->assignRole('utilisateur');

        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('dashboard');
    }

    public function logout(Request $request) {

        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login');
    }

    public function showForgotPassword() {

        return Inertia::render('Auth/ForgotPassword');
    }

    public function sendResetLink(Request $request) {

        $data = $request->validate(['email' => ['required', 'string', 'email']]);

        $status = Password::sendResetLink($data);

        if ($status !== Password::RESET_LINK_SENT) {
            throw ValidationException::withMessages(['email' => trans($status)]);
        }

        return back()->with(['message' => trans($status), 'type' => 'success']);
    }

    public function showResetPassword(Request $request, string $token) {

        return Inertia::render('Auth/ResetPassword', [
            'token' => $token,
            'email' => $request->query('email'),
        ]);
    }

    public function resetPassword(Request $request) {
        
        $data = $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'confirmed', PasswordRule::min(8)->letters()->numbers()],
        ]);

        $status = Password::reset(
            array_merge($data, ['password_confirmation' => $request->input('password_confirmation')]),
            function (User $user, string $password) {
                $user->forceFill(['password' => $password])->save();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            throw ValidationException::withMessages(['email' => trans($status)]);
        }

        return redirect()->route('login')->with(['message' => trans($status), 'type' => 'success']);
    }
}
