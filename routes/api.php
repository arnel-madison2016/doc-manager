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

Route::prefix('v1')->group(function () {

    // --- Authentification (publique) ---
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->name('forgot-password');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');

    // --- Routes protégées (cookie de session SPA ou jeton Bearer Sanctum) ---
    Route::middleware('auth:sanctum')->group(function () {

        // Déconnexion (authentification)
        Route::post('logout', [AuthController::class, 'logout']);

        // Profil utilisateur — §4.1 Cahier des charges (ProfileController)
        Route::get('me', [ProfileController::class, 'show']);
        Route::put('me', [ProfileController::class, 'update']);
        Route::put('me/password', [ProfileController::class, 'updatePassword']);
        Route::post('me/avatar', [ProfileController::class, 'updateAvatar']);
        Route::delete('me/avatar', [ProfileController::class, 'deleteAvatar']);

        // Catégories — lecture ouverte à tout utilisateur authentifié,
        // écriture réservée à la permission "categories.gerer" (rôle administrateur).
        Route::get('categories', [CategorieController::class, 'index']);
        Route::get('categories/{categorie}/domaines', [CategorieController::class, 'domaines']);
        Route::middleware('permission:categories.gerer')->group(function () {
            Route::post('categories', [CategorieController::class, 'store']);
            Route::put('categories/{categorie}', [CategorieController::class, 'update']);
            Route::delete('categories/{categorie}', [CategorieController::class, 'destroy']);
        });

        // Domaines — écriture réservée à la permission "domaines.gerer".
        Route::middleware('permission:domaines.gerer')->group(function () {
            Route::post('domaines', [DomaineController::class, 'store']);
            Route::put('domaines/{domaine}', [DomaineController::class, 'update']);
            Route::delete('domaines/{domaine}', [DomaineController::class, 'destroy']);
        });

        // Documents — l'accès aux documents d'autrui (permission "documents.voir-tous")
        // est arbitré finement par DocumentController/DocumentPolicy, pas ici.
        Route::get('documents', [DocumentController::class, 'index']);
        Route::post('documents', [DocumentController::class, 'store']);
        Route::get('documents/{document}', [DocumentController::class, 'show']);
        Route::put('documents/{document}', [DocumentController::class, 'update']);
        Route::delete('documents/{document}', [DocumentController::class, 'destroy']);
        Route::post('documents/{document}/restore', [DocumentController::class, 'restore']);
        Route::get('documents/{document}/preview', [DocumentController::class, 'preview']);
        Route::get('documents/{document}/download', [DocumentController::class, 'download']);

        Route::post('documents/{document}/versions', [DocumentController::class, 'storeVersion']);
        Route::get('documents/{document}/versions', [DocumentController::class, 'indexVersions']);
        Route::post('documents/{document}/versions/{version}/restore', [DocumentController::class, 'restoreVersion']);

        // Journal d'actions — EF-12 (§5 Spécification API). Implémentation dans
        // ProfileController::journal() : il s'agit de l'historique personnel de
        // l'utilisateur authentifié, qui fait partie du module "Gestion des profils".
        Route::get('journal', [ProfileController::class, 'journal']);

        // Supervision des comptes et des rôles — réservée à la permission
        // "utilisateurs.gerer" (rôle administrateur, §2.3 Cahier des charges).
        Route::middleware('permission:utilisateurs.gerer')->prefix('admin')->group(function () {
            Route::get('users', [UserController::class, 'index']);
            Route::get('users/{user}', [UserController::class, 'show']);
            Route::put('users/{user}/role', [UserController::class, 'updateRole']);
        });
    });
});