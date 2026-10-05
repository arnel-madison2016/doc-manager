<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name',
        'type',
    ];

    public function domaines() {

        return $this->hasMany(Domaine::class);
    }

    public function documents()  {

        return $this->hasMany(Document::class);
    }
}
