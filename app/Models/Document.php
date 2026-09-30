<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'user_id',
        'categorie_id',
        'domaine_id',
        'type',
        'titre',
        'description',
        'numero_acte',
        'type_acte',
        'autorite_emettrice',
        'date_signature',
        'auteur',
        'editeur',
        'isbn',
        'hash_sha256',
        'statut',
        'corbeille_at',
    ];

    protected function casts(): array {
        
        return [
            'date_signature' => 'date',
            'corbeille_at' => 'datetime',
        ];
    }

    public function user() {

        return $this->belongsTo(User::class);
    }

    public function categorie() {

        return $this->belongsTo(Categorie::class);
    }

    public function domaine() {

        return $this->belongsTo(Domaine::class);
    }

    public function versions() {

        return $this->hasMany(DocumentVersion::class)->orderByDesc('numero_version');
    }

    // Version active exposée par défaut à la consultation/téléchargement (RG-03).
    public function versionActive() {

        return $this->hasOne(DocumentVersion::class)->where('est_active', true);
    }

    public function journalActions() {

        return $this->hasMany(JournalAction::class);
    }

    public function scopeTexteAdministratif($query) {

        return $query->where('type', 'texte_administratif');
    }

    public function scopeLivrePersonnel($query) {

        return $query->where('type', 'livre_personnel');
    }

    public function scopeHorsCorbeille($query) {

        return $query->where('statut', '!=', 'corbeille');
    }
}
