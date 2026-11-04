<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ProfileController extends Controller
{
    public function __construct(protected AccountService $accountService) {

    }

    public function edit(Request $request) {

        $user = $request->user();

        return Inertia::render('Profile/Edit', [
            'profile' => [
            'id' => $user->id,
            'name' => $user->name, // Correspond à la colonne 'nom' de la base de données
            'email' => $user->email,
            'avatar_path' => $user->avatar_path,
            'roles' => $user->getRoleNames(),
        ],
            'tokens' => $request->user()->tokens()->get(['id', 'name', 'last_used_at', 'created_at']),
        ]);
    }

    public function update(Request $request) {

        $user = $request->user();
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,' . $user->id],
        ]);

        $user->update($data);

        return back()->with('success', 'Profil mis à jour.');
    }

    public function updatePassword(Request $request) {

        $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($request->password),
        ]);

        return back()->with('success', 'Mot de passe modifié.');
    }

    public function updateAvatar(Request $request) {

        $request->validate([
            'avatar' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->update(['avatar_path' => $path]);

        return back()->with('success', 'Avatar mis à jour.');
    }

    public function destroyAvatar(Request $request) {

        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->update(['avatar_path' => null]);
        }

        return back()->with('success', 'Avatar supprimé.');
    }

    public function destroyToken(Request $request, int $token) {

        $request->user()->tokens()->where('id', $token)->delete();
        return back()->with('success', 'Appareil déconnecté.');
    }

    public function export(Request $request) {

        $data = $this->accountService->export($request->user());
        return response()->json($data)->downlaod('gedoc-export-' . now()->format('Y-m-d') . '.json');
    }

    public function destroy(Request $request) {
        
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $this->accountService->delete($request->user());

        auth()->guard()->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
