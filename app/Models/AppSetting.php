<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class AppSetting extends Model
{
    protected $fillable = [
        'cle', 
        'valeur'
    ];
 
    protected function casts(): array { 
        return [
            'valeur' => 'array'
        ]; 
    }
 
    /** Tous les réglages (défauts de config/gedoc.php surchargés par la base), mis en cache. */
    public static function allCached(): array {

        return Cache::rememberForever('app_settings', fn () => array_merge(
            config('gedoc.defaults'),
            static::query()->pluck('valeur', 'cle')->all(),
        ));
    }
 
    public static function read(string $cle, mixed $defaut = null): mixed {

        return static::allCached()[$cle] ?? $defaut;
    }
 
    public static function write(string $cle, mixed $valeur): void {

        static::updateOrCreate(['cle' => $cle], ['valeur' => $valeur]);
        Cache::forget('app_settings');
    }
}
