<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Document;
use App\Models\JournalAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users_count' => User::count(),
                'documents_count' => Document::where('statut', '!=', 'corbeille')->count(),
                'trash_count' => Document::where('statut', 'corbeille')->count(),
                'storage_used_mb' => round(collect(Storage::disk('local')->allFiles('documents'))
                    ->sum(fn ($file) => Storage::disk('local')->size($file)) / 1024 / 1024, 2),
            ],
            'recent_activity' => JournalAction::with('user')->latest()->take(10)->get(),
        ]);
    }
}
