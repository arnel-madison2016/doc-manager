<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('categorie_id')->constrained('categories');
            $table->foreignId('domaine_id')->nullable()->constrained('domaines')->nullOnDelete();

            $table->enum('type', ['texte_administratif', 'livre_personnel', 'autre']);
            $table->string('titre', 150);
            $table->text('description')->nullable();

            // Champs spécifiques TexteAdministratif
            $table->string('numero_acte', 100)->nullable();
            $table->enum('type_acte', ['loi', 'ordonnance', 'decret', 'arrete', 'decision', 'note de service', 'circulaire', 'comunique'])->nullable();
            $table->string('autorite_emettrice')->nullable();
            $table->date('date_signature')->nullable();

            // Champs spécifiques LivrePersonnel
            $table->string('auteur', 100)->nullable();
            $table->string('editeur', 100)->nullable();
            $table->string('isbn', 20)->nullable();

            $table->char('hash_sha256', 64);
            $table->enum('statut', ['brouillon', 'publie', 'corbeille'])->default('brouillon');
            // Horodatage de mise en corbeille : nécessaire pour calculer le délai de
            // rétention (RG-05, 30 jours par défaut) avant purge définitive planifiée.
            $table->timestamp('corbeille_at')->nullable();
            $table->timestamps();

            $table->index(['categorie_id', 'domaine_id']);
            $table->index('hash_sha256');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
