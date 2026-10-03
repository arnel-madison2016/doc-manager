<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

// Supervision des comptes utilisateurs par l'administrateur — §2.3 du Cahier des
// charges ("Supervise les comptes [...] la maintenance des données") et §4.1
// ("Gestion des rôles applicatifs [...] avec droits différenciés"). Routes
// protégées par le middleware `permission:utilisateurs.gerer`.
class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    // GET /api/v1/admin/users
    public function index(Request $request) {

        $users = User::query()
            ->with('roles:name')
            ->orderBy('nom')
            ->paginate(min((int) $request->query('per_page', 20), 100));

        return response()->json([
            'data' => collect($users->items())->map->toApiArray(),
            'meta' => [
                'current_page' => $users->currentPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
                'last_page' => $users->lastPage(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {
        
        //
    }

    /**
     * Display the specified resource.
     */
    // GET /api/v1/admin/users/{user}
    public function show(User $user) {

        return response()->json($user->toApiArray());
    }

    /**
     * Update the specified resource in storage.
     */
    // PUT /api/v1/admin/users/{user}/role
    public function update(Request $request, User $user) {

        $data = $request->validate([
            'role' => ['required', 'in:utilisateur,administrateur'],
        ]);

        // Un seul rôle actif à la fois dans ce modèle applicatif (§9.2 Cahier des
        // charges : rôles "Utilisateur" et "Administrateur" mutuellement exclusifs).
        if ($request->user()->is($user) && $data['role'] !== 'administrateur') {
            // Garde-fou : un administrateur ne peut pas se rétrograder lui-même et
            // risquer de verrouiller l'accès à la supervision des comptes.
            return response()->json([
                'message' => 'Un administrateur ne peut pas modifier son propre rôle.',
            ], 422);
        }

        $user->syncRoles([$data['role']]);

        return response()->json($user->toApiArray());
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id) {

        //
    }
}
