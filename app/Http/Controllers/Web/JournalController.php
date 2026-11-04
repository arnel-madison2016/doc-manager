<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\JournalAction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JournalController extends Controller
{
    public function index(Request $request) {
        
        $query = JournalAction::where('user_id', $request->user()->id)->latest();

        if ($request->filled('action')) {
            $query->where('action', $request->action);
        }

        return Inertia::render('Journal/Index', [
            'actions' => $query->paginate(20)->withQueryString(),
            'filters' => $request->only(['action']),
        ]);
    }
}
