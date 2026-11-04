<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {

        // S'assurer que le rôle administrateur existe
        $adminRole = Role::firstOrCreate(['name' => 'administrateur']);

        // Créer ou mettre à jour l'utilisateur admin
        $admin = User::updateOrCreate(
            ['email' => 'guest@gedoc.com'],
            [
                'name' => 'guest',
                'password' => Hash::make('admin24'),
                'email_verified_at' => now(),
            ]
        );

        // Assigner le rôle si ce n'est pas déjà fait
        if (!$admin->hasRole('administrateur')) {
            $admin->assignRole($adminRole);
        }
    }
}
