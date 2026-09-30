<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JournalAction extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'document_id',
        'action',
        'created_at',
    ];

    protected function casts(): array {

        return [
            'created_at' => 'datetime',
        ];
    }

    public function user() {

        return $this->belongsTo(User::class);
    }

    public function document() {

        return $this->belongsTo(Document::class);
    }

    // Petite fabrique utilitaire réutilisée par les contrôleurs pour journaliser
    // une action sans dupliquer la logique de création (RG-06).
    public static function log(int $userId, ?int $documentId, string $action): self  {
        
        return static::create([
            'user_id' => $userId,
            'document_id' => $documentId,
            'action' => $action,
            'created_at' => now(),
        ]);
    }
}
