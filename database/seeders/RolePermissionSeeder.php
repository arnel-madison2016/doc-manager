<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

// Définit les permissions fines du projet GEDoc et les deux rôles applicatifs
// prévus au §2.3 du Cahier des charges (Utilisateur, Administrateur).
//
// Permissions :
//  - categories.gerer   : créer/modifier/supprimer une catégorie (§4.2, §3 Spéc. API)
//  - domaines.gerer      : créer/modifier/supprimer un domaine (§4.2, §3 Spéc. API)
//  - documents.voir-tous : consulter/agir sur les documents de tous les utilisateurs,
//                          et pas uniquement les siens (RG-01 du Dossier de conception
//                          détaillée — bypass réservé à l'administrateur)
class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void  {

        $permissions = [
            'categories.gerer',
            'domaines.gerer',
            'documents.voir-tous',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        $utilisateur = Role::firstOrCreate(['name' => 'utilisateur']);
        // Rôle par défaut : aucune permission particulière, l'accès à ses propres
        // documents reste géré par la propriété (user_id) via DocumentPolicy.

        $administrateur = Role::firstOrCreate(['name' => 'administrateur']);
        $administrateur->syncPermissions($permissions);

        $this->command?->info('Rôles et permissions GEDoc initialisés : utilisateur, administrateur.');
    }
}
