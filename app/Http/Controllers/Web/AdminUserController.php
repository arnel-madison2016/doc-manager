<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AccountService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    public function __construct(protected AccountService $accountService) {}

    public function index(Request $request) {

        $query = User::with('roles')->withCount('documents');

        if ($request->filled('q')) {
            $q = $request->q;
            $query->where(fn($sub) => $sub->where('name', 'like', "%{$q}%")
                ->orWhere('email', 'like', "%{$q}%"));
        }

        return Inertia::render('Admin/Users', [
            'users' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['q']),
        ]);
    }

    public function store(Request $request) {

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users'],
            'role' => ['required', 'exists:roles,name'],
        ]);

        $user = User::create([
            'name' => $data['nom'],
            'email' => $data['email'],
            'password' => Hash::make(Str::random(16)),
        ]);

        $user->assignRole($data['role']);

        return back()->with('success', 'Utilisateur créé avec succès.');
    }

    public function updateRole(Request $request, User $user) {

        if ($user->id === $request->user()->id) {
            return back()->withErrors(['role' => 'Vous ne pouvez pas modifier votre propre rôle.']);
        }

        $data = $request->validate([
            'role' => ['required', 'exists:roles,name'],
        ]);

        $user->syncRoles([$data['role']]);

        return back()->with('success', "Rôle de l'utilisateur mis à jour.");
    }

    public function export(User $user) {
        
        $data = $this->accountService->export($user);
        return response()->json($data)->download("gedoc-user-export-{$user->id}-" . now()->format('Y-m-d') . '.json');
    }
}
