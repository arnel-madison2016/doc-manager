<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Domaine;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// Alimente les tables de référence "categories" et "domaines" — §4.2 (classification
// documentaire) et §7 (catégorisation documentaire spécifique) du Cahier des charges.
//
// Deux temps distincts :
//  1) seedTaxonomieReference() : la taxonomie réellement exploitée par l'application
//     (les deux catégories citées dans le Dossier de conception détaillée et leurs
//     domaines), créée de façon déterministe via firstOrCreate — à exécuter aussi
//     bien en développement qu'en production, sans risque de duplication si rejoué.
//  2) seedDonneesExemple() : catégories/domaines supplémentaires générés via les
//     factories (Faker), utiles en développement pour tester pagination, recherche
//     multicritère et filtres (§4.4 Cahier des charges) sur un jeu de données plus
//     large. À réserver aux environnements non productifs.
class CategorieDomaineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {

        $this->seedTaxonomieReference();

        if (! app()->isProduction()) {
            $this->seedDonneesExemple();
        }
    }

    private function seedTaxonomieReference(): void {

        $administratif = Categorie::firstOrCreate(
            ['name' => 'Textes administratifs'],
            ['type' => 'administratif']
        );

        foreach (['Decret', 'Arrete', 'Decision'] as $libelle) {
            Domaine::firstOrCreate([
                'categorie_id' => $administratif->id,
                'name' => $libelle,
            ]);
        }

        $personnel = Categorie::firstOrCreate(
            ['name' => 'Livres personnels'],
            ['type' => 'personnel']
        );

        foreach (['Informatique', 'Agriculture', 'Politique'] as $libelle) {
            Domaine::firstOrCreate([
                'categorie_id' => $personnel->id,
                'name' => $libelle,
            ]);
        }

        $this->command?->info('Taxonomie de référence : 2 catégories, 6 domaines.');
    }

    private function seedDonneesExemple(): void {

        // Jusqu'à 5 catégories par type (limite des pools de noms plausibles des
        // factories, via faker->unique() — cf. CategorieFactory).
        Categorie::factory()->administratif()->count(3)->create()
            ->each(function (Categorie $categorie) {
                Domaine::factory()->count(2)->pourCategorie($categorie)->create();
            });

        Categorie::factory()->personnel()->count(3)->create()
            ->each(function (Categorie $categorie) {
                Domaine::factory()->count(2)->pourCategorie($categorie)->create();
            });

        $this->command?->info("Données d'exemple : 6 catégories et 12 domaines supplémentaires.");
    }
}
