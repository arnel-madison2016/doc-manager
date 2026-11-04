<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\Admin;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\CategorieController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\DocumentController;
use App\Http\Controllers\Web\DomaineController;
use App\Http\Controllers\Web\JournalController;
use App\Http\Controllers\Web\PreferenceController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\SettingsController;
use Inertia\Inertia;

Route::pattern('document', '[0-9]+');
Route::pattern('version', '[0-9]+');
// Correction : Suppression du pattern numérique restrictif sur 'token' car les tokens d'API/personnels sont souvent alphanumériques.

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// ---- Invités ----
Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1');
 
    // Assurez-vous que le middleware 'registration.open' existe, sinon retirez-le ou remplacez-le
    Route::middleware('registration.open')->group(function () {
        Route::get('register', [AuthController::class, 'showRegister'])->name('register');
        Route::post('register', [AuthController::class, 'register']);
    });
 
    Route::get('forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
    Route::post('forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email');
    Route::get('reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->name('password.store');
});

// Thème et langue : visiteurs comme connectés
Route::put('preferences', [PreferenceController::class, 'update'])->name('preferences.update');
 
// ---- Utilisateurs connectés ----
Route::middleware('auth')->group(function () {
    Route::post('logout', [AuthController::class, 'logout'])->name('logout');
    
    // Route dédiée pour le tableau de bord
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
 
    Route::prefix('documents')->name('documents.')->group(function () {
        Route::get('/', [DocumentController::class, 'index'])->name('index');
        Route::get('create', [DocumentController::class, 'create'])->name('create');
        Route::post('/', [DocumentController::class, 'store'])->name('store');
        Route::get('corbeille', [DocumentController::class, 'trash'])->name('trash');
 
        Route::get('{document}', [DocumentController::class, 'show'])->name('show');
        Route::get('{document}/edit', [DocumentController::class, 'edit'])->name('edit');
        Route::put('{document}', [DocumentController::class, 'update'])->name('update');
        Route::delete('{document}', [DocumentController::class, 'destroy'])->name('destroy');
        Route::post('{document}/restore', [DocumentController::class, 'restore'])->name('restore');
        Route::get('{document}/preview', [DocumentController::class, 'preview'])->name('preview');
        Route::get('{document}/download', [DocumentController::class, 'download'])->name('download');
 
        Route::get('{document}/versions', [DocumentController::class, 'versions'])->name('versions.index');
        Route::post('{document}/versions', [DocumentController::class, 'storeVersion'])->name('versions.store');
        Route::post('{document}/versions/{version}/restore', [DocumentController::class, 'restoreVersion'])
            ->name('versions.restore');
    });

    Route::get('categories', [CategorieController::class, 'index'])->name('categories.index');
    Route::middleware('permission:categories.gerer')->group(function () {
        Route::post('categories', [CategorieController::class, 'store'])->name('categories.store');
        Route::put('categories/{categorie}', [CategorieController::class, 'update'])->name('categories.update');
        Route::delete('categories/{categorie}', [CategorieController::class, 'destroy'])->name('categories.destroy');
    });
    Route::middleware('permission:domaines.gerer')->group(function () {
        Route::post('domaines', [DomaineController::class, 'store'])->name('domaines.store');
        Route::put('domaines/{domaine}', [DomaineController::class, 'update'])->name('domaines.update');
        Route::delete('domaines/{domaine}', [DomaineController::class, 'destroy'])->name('domaines.destroy');
    });

    Route::prefix('profil')->name('profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::put('/', [ProfileController::class, 'update'])->name('update');
        Route::put('mot-de-passe', [ProfileController::class, 'updatePassword'])->middleware('throttle:6,1')->name('password');
        Route::post('avatar', [ProfileController::class, 'updateAvatar'])->name('avatar.update');
        Route::delete('avatar', [ProfileController::class, 'destroyAvatar'])->name('avatar.destroy');
        Route::delete('jetons/{token}', [ProfileController::class, 'destroyToken'])->name('tokens.destroy');
        Route::get('export', [ProfileController::class, 'export'])->name('export');
        Route::delete('/', [ProfileController::class, 'destroy'])->middleware('throttle:6,1')->name('destroy');
    });

    Route::get('parametres', [SettingsController::class, 'edit'])->name('settings.edit');
    Route::put('parametres', [SettingsController::class, 'update'])->name('settings.update');

    Route::get('journal', [JournalController::class, 'index'])->name('journal.index');

    // ---- Administration ----
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::middleware('permission:utilisateurs.gerer')->group(function () {
            Route::get('/', [Admin\DashboardController::class, 'index'])->name('dashboard');
            Route::get('utilisateurs', [Admin\UserController::class, 'index'])->name('users.index');
            Route::post('utilisateurs', [Admin\UserController::class, 'store'])->name('users.store');
            Route::put('utilisateurs/{user}/role', [Admin\UserController::class, 'updateRole'])->name('users.role');
            Route::get('utilisateurs/{user}/export', [Admin\UserController::class, 'export'])->name('users.export');
        });
        
        Route::middleware('permission:parametres.gerer')->group(function () {
            Route::get('parametres', [Admin\SettingsController::class, 'edit'])->name('settings.edit');
            Route::put('parametres', [Admin\SettingsController::class, 'update'])->name('settings.update');
            Route::post('parametres/logo', [Admin\SettingsController::class, 'uploadLogo'])->name('settings.logo.store');
            Route::delete('parametres/logo', [Admin\SettingsController::class, 'destroyLogo'])->name('settings.logo.destroy');
        });
    });
});