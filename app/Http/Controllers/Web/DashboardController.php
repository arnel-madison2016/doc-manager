<?php

namespace App\Http\Controllers\Web;

use App\Models\Document;
use App\Http\Controllers\Controller;
use App\Models\JournalAction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;


class DashboardController extends Controller
{
    /**
     * Affiche le tableau de bord principal.
     */
    public function index(Request $request): Response {

        $user = $request->user();
        $isAdmin = $user->hasRole('admin');

        // Requêtes de base filtrées selon le rôle
        $documentQuery = Document::query();
        $activityQuery = JournalAction::with(['user', 'document']);

        if (!$isAdmin) {
            $documentQuery->where('user_id', $user->id);
            $activityQuery->where('user_id', $user->id);
        }

        $documentQuery->where('statut', '!=', 'corbeille');

        // Calcul sécurisé de l'espace de stockage via la table document_versions
        $totalBytes = DB::table('document_versions')
            ->join('documents', 'document_versions.document_id', '=', 'documents.id')
            ->when(!$isAdmin, fn($q) => $q->where('documents.user_id', $user->id))
            ->where('documents.statut', '!=', 'corbeille')
            ->where('document_versions.est_active', true)
            ->sum('taille');

        $storageUsed = $this->formatBytes($totalBytes);

        // Statistiques globales (correction de 'empreinte' en 'empreinte_sha256')
        $stats = [
            'total_documents' => (clone $documentQuery)->count(),
            'verified_documents' => (clone $documentQuery)->whereNotNull('hash_sha256')->count(),
            'storage_used' => $storageUsed,
            'draft_documents' => (clone $documentQuery)->where('statut', 'brouillon')->count(),
        ];        

        // Documents récents
        $recentDocuments = (clone $documentQuery)
            ->with(['categorie', 'domaine'])
            ->latest()
            ->take(4)
            ->get();

        // Activité récente issue de JournalAction
        $activities = $activityQuery
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get();

        return Inertia::render('Dashboard', [
            'stats' => $stats,
            'recentDocuments' => $recentDocuments,
            'activities' => $activities,
        ]);
    }

    /**
     * Utilitaire pour formater les octets en Ko, Mo ou Go.
     */
    private function formatBytes($bytes, $precision = 2): string {

        if ($bytes <= 0) {
            return '0 Mo';
        }

        $units = ['Octets', 'Ko', 'Mo', 'Go', 'To'];
        $pow = floor(log($bytes, 1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}
