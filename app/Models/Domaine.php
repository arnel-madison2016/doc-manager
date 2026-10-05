<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Domaine extends Model
{
    protected $fillable = [
        'categorie_id',
        'name',
    ];

    public function categorie() {

        return $this->belongsTo(Categorie::class);
    }

    public function documents() {
        
        return $this->hasMany(Document::class);
    }
}
