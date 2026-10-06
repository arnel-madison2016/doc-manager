<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Domaine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Domaine>
 *
 * Libellés plausibles selon la nature de la catégorie parente (§4.2 et §7 du Cahier
 * des charges) : type d'acte pour une catégorie administrative, thème libre pour une
 * catégorie personnelle. Distincts des domaines de référence réellement utilisés par
 * l'application (Decret, Arrete, Decision, Informatique, Agriculture, Politique,
 * créés de façon déterministe par CategorieDomaineSeeder).
 */
class DomaineFactory extends Factory
{
    protected $model = Domaine::class;

    private const LIBELLES_ADMINISTRATIF = ['Circulaire', 'Ordonnance', 'Instruction', 'Note de service', 'Decret', 'Loi'];
    private const LIBELLES_PERSONNEL = ['Histoire', 'Economie', 'Sante', 'Cuisine', 'Voyage', 'Informatique & Reseaux'];

    public function definition(): array {

        return [
            'categorie_id' => Categorie::factory(),
            // Pas de type de catégorie connu à ce stade (categorie_id n'est pas
            // encore résolu) : libellé pris sur l'ensemble des deux pools. Préférer
            // l'état pourCategorie() ci-dessous pour un résultat sémantiquement cohérent.
            'name' => $this->faker->randomElement(
                array_merge(self::LIBELLES_ADMINISTRATIF, self::LIBELLES_PERSONNEL)
            ),
        ];
    }

    // État : rattache le domaine à une catégorie précise déjà créée, et choisit un
    // libellé cohérent avec son type. NB : ne garantit pas l'unicité du libellé au
    // sein d'une même catégorie (aucune contrainte de ce type en base) — acceptable
    // pour des données d'exemple, à éviter pour de la donnée de production.
    public function pourCategorie(Categorie $categorie): static {

        $pool = $categorie->type === 'administratif' ? self::LIBELLES_ADMINISTRATIF : self::LIBELLES_PERSONNEL;

        return $this->state(fn () => [
            'categorie_id' => $categorie->id,
            'name' => $this->faker->randomElement($pool),
        ]);
    }
}
