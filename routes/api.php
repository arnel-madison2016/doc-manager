<?php

use Illuminate\Http\Request;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategorieController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\DomaineController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

// Route::get('/user', function (Request $request) {
//    return $request->user();
// })->middleware('auth:sanctum');

// Toutes les routes sont préfixées /api/v1 (§1.1 de la Spécification API).
// NB : GET /sanctum/csrf-cookie est fournie automatiquement par le package Sanctum,
// aucune déclaration manuelle n'est nécessaire ici.
//
// Autorisation par rôles/permissions (spatie/laravel-permission) : les alias de
// middleware 'permission' et 'role' doivent être enregistrés dans bootstrap/app.php
// (cf. SETUP.md). Les permissions "categories.gerer" et "domaines.gerer" ne sont
// accordées qu'au rôle "administrateur" (cf. database/seeders/RolePermissionSeeder.php).

Route::prefix('v1')->name('v1.')->group(function () {

    // --- Authentification (publique) ---
    Route::name('auth.')->group(function () {
        Route::post('register', [AuthController::class, 'register'])->name('register');
        Route::post('login', [AuthController::class, 'login'])->name('login');
        Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('password.forgot');
        Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
    });

    // --- Routes protégées (cookie de session SPA ou jeton Bearer Sanctum) ---
    Route::middleware('auth:sanctum')->group(function () {

        // Déconnexion (authentification) — nom final : v1.auth.logout
        Route::post('logout', [AuthController::class, 'logout'])->name('auth.logout');

        // Profil utilisateur — §4.1 Cahier des charges (ProfileController)
        // Noms finaux : v1.profile.show, v1.profile.update, ...
        Route::name('profile.')->group(function () {
            Route::get('me', [ProfileController::class, 'show'])->name('show');
            Route::put('me', [ProfileController::class, 'update'])->name('update');
            Route::put('me/password', [ProfileController::class, 'updatePassword'])->name('password.update');
            Route::post('me/avatar', [ProfileController::class, 'updateAvatar'])->name('avatar.update');
            Route::delete('me/avatar', [ProfileController::class, 'deleteAvatar'])->name('avatar.delete');
        });

        // Catégories — lecture ouverte à tout utilisateur authentifié,
        // écriture réservée à la permission "categories.gerer" (rôle administrateur).
        // Noms finaux : v1.categories.index, v1.categories.store, ...
        Route::name('categories.')->group(function () {
            Route::get('categories', [CategorieController::class, 'index'])->name('index');
            Route::get('categories/{categorie}/domaines', [CategorieController::class, 'domaines'])->name('domaines');

            Route::middleware('permission:categories.gerer')->group(function () {
                Route::post('categories', [CategorieController::class, 'store'])->name('store');
                Route::put('categories/{categorie}', [CategorieController::class, 'update'])->name('update');
                Route::delete('categories/{categorie}', [CategorieController::class, 'destroy'])->name('destroy');
            });
        });

        // Domaines — écriture réservée à la permission "domaines.gerer".
        // Noms finaux : v1.domaines.store, v1.domaines.update, v1.domaines.destroy
        Route::middleware('permission:domaines.gerer')->name('domaines.')->group(function () {
            Route::post('domaines', [DomaineController::class, 'store'])->name('store');
            Route::put('domaines/{domaine}', [DomaineController::class, 'update'])->name('update');
            Route::delete('domaines/{domaine}', [DomaineController::class, 'destroy'])->name('destroy');
        });

        // Documents — l'accès aux documents d'autrui (permission "documents.voir-tous")
        // est arbitré finement par DocumentController/DocumentPolicy, pas ici.
        // Noms finaux : v1.documents.index, v1.documents.versions.store, ...
        Route::name('documents.')->group(function () {
            Route::get('documents', [DocumentController::class, 'index'])->name('index');
            Route::post('documents', [DocumentController::class, 'store'])->name('store');
            Route::get('documents/{document}', [DocumentController::class, 'show'])->name('show');
            Route::put('documents/{document}', [DocumentController::class, 'update'])->name('update');
            Route::delete('documents/{document}', [DocumentController::class, 'destroy'])->name('destroy');
            Route::post('documents/{document}/restore', [DocumentController::class, 'restore'])->name('restore');
            Route::get('documents/{document}/preview', [DocumentController::class, 'preview'])->name('preview');
            Route::get('documents/{document}/download', [DocumentController::class, 'download'])->name('download');

            Route::name('versions.')->group(function () {
                Route::post('documents/{document}/versions', [DocumentController::class, 'storeVersion'])->name('store');
                Route::get('documents/{document}/versions', [DocumentController::class, 'indexVersions'])->name('index');
                Route::post('documents/{document}/versions/{version}/restore', [DocumentController::class, 'restoreVersion'])->name('restore');
            });
        });

        // Journal d'actions — EF-12 (§5 Spécification API). Implémentation dans
        // ProfileController::journal() : il s'agit de l'historique personnel de
        // l'utilisateur authentifié, qui fait partie du module "Gestion des profils".
        // Nom final : v1.journal.index
        Route::get('journal', [ProfileController::class, 'journal'])->name('journal.index');

        // Supervision des comptes et des rôles — réservée à la permission
        // "utilisateurs.gerer" (rôle administrateur, §2.3 Cahier des charges).
        // Noms finaux : v1.admin.users.index, v1.admin.users.show, v1.admin.users.role.update
        Route::middleware('permission:utilisateurs.gerer')->prefix('admin')->name('admin.users.')->group(function () {
            Route::get('users', [UserController::class, 'index'])->name('index');
            Route::get('users/{user}', [UserController::class, 'show'])->name('show');
            Route::put('users/{user}/role', [UserController::class, 'updateRole'])->name('role.update');
        });
    });
});