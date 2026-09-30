<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentVersion extends Model
{
    public $timestamps = false; // seule created_at est utilisée (cf. migration)

    protected $fillable = [
        'document_id',
        'numero_version',
        'chemin_fichier',
        'taille',
        'est_active',
        'created_at',
    ];

    protected function casts(): array {

        return [
            'est_active' => 'boolean',
            'created_at' => 'datetime',
        ];
    }

    public function document() {
        
        return $this->belongsTo(Document::class);
    }
}
