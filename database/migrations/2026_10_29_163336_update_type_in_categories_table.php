<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. On remplace toutes les valeurs qui ne sont pas dans la nouvelle liste par 'autre'
        DB::table('categories')
            ->whereNotIn('type', ['texte_administratif', 'livre_personnel', 'autre'])
            ->update(['type' => 'autre']);

        Schema::table('categories', function (Blueprint $table) {
            $table->enum('type', ['texte_administratif', 'livre_personnel', 'autre'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->enum('type', ['administratif', 'personnel', 'autre'])->change();
        });
    }
};
