<?php

namespace Database\Factories;

use App\Models\Categorie;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Categorie>
 *
 * Noms plausibles, distincts des deux catégories de référence réellement utilisées
 * par l'application ("Textes administratifs", "Livres personnels", créées de façon
 * déterministe par CategorieDomaineSeeder) afin d'éviter toute collision avec la
 * contrainte d'unicité de la colonne "nom" lors de la génération de données d'exemple.
 * cf. §7 (catégorisation documentaire) et §2.1 du Cahier des charges.
 */
class CategorieFactory extends Factory
{
    protected $model = Categorie::class;

    private const NOMS_ADMINISTRATIF = [
        'Actes réglementaires',
        'Correspondance officielle',
        'Documents fiscaux',
        'Documents notariés',
        'Marchés publics',
    ];

    private const NOMS_PERSONNEL = [
        'Bibliothèque technique',
        'Revues et magazines',
        'Cours et formations',
        'Archives personnelles',
        'Carnets de notes',
    ];

    public function definition(): array {

        $type = $this->faker->randomElement(['administratif', 'personnel']);

        return [
            'name' => $this->faker->unique()->randomElement($this->pool($type)),
            'type' => $type,
        ];
    }

    // État : force une catégorie de type "administratif" avec un nom cohérent.
    public function administratif(): static {

        return $this->state(fn () => [
            'name' => $this->faker->unique()->randomElement(self::NOMS_ADMINISTRATIF),
            'type' => 'administratif',
        ]);
    }

    // État : force une catégorie de type "personnel" avec un nom cohérent.
    public function personnel(): static {

        return $this->state(fn () => [
            'name' => $this->faker->unique()->randomElement(self::NOMS_PERSONNEL),
            'type' => 'personnel',
        ]);
    }
}
