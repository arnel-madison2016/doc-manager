<?php

namespace App\Http\Controllers\Api;

use App\Models\JournalAction;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Validation\ValidationException;

// Module "Gestion des profils utilisateurs" — §4.1 du Cahier des charges :
// consultation/modification du profil (nom, email, mot de passe, photo optionnelle)
// et historique de connexion personnel (EF-12), pour l'utilisateur authentifié.
class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    
    public function index() {

        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    // GET /api/v1/me
    public function show(Request $request) {

        return response()->json($request->user()->toApiArray());
    }

    /**
     * Update the specified resource in storage.
     */
    // PUT /api/v1/me — EF-02
    public function update(Request $request) {

        $data = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => [
                'sometimes', 'required', 'string', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($request->user()->id),
            ],
        ]);

        $request->user()->update($data);

        return response()->json($request->user()->toApiArray());
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

    // POST /api/v1/me/avatar — photo de profil optionnelle (§4.1 Cahier des charges)
    public function updateAvatar(Request $request) {
        
        $data = $request->validate([
            'avatar' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $user = $request->user();

        // Remplace l'ancienne photo le cas échéant (évite d'accumuler des fichiers orphelins).
        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
        }

        $chemin = $data['avatar']->store('avatars', 'public');
        $user->update(['avatar_path' => $chemin]);

        return response()->json($user->toApiArray());
    }

    // DELETE /api/v1/me/avatar
    public function deleteAvatar(Request $request) {

        $user = $request->user();

        if ($user->avatar_path) {
            Storage::disk('public')->delete($user->avatar_path);
            $user->update(['avatar_path' => null]);
        }

        return response()->json($user->toApiArray());
    }

    // GET /api/v1/me/journal — EF-12 : historique de connexion / actions personnelles
    public function journal(Request $request) {

        $query = JournalAction::where('user_id', $request->user()->id)
            ->when($request->filled('document_id'), fn ($q) => $q->where('document_id', $request->query('document_id')))
            ->when($request->filled('action'), fn ($q) => $q->where('action', $request->query('action')))
            ->orderByDesc('created_at');

        $journal = $query->paginate(min((int) $request->query('per_page', 20), 100));

        return response()->json([
            'data' => $journal->items(),
            'meta' => [
                'current_page' => $journal->currentPage(),
                'per_page' => $journal->perPage(),
                'total' => $journal->total(),
                'last_page' => $journal->lastPage(),
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {
        
        //
    }
}
