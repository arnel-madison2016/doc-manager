<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

// Depuis Laravel 11, le contrôleur de base généré par le squelette est vide :
// le trait AuthorizesRequests (méthode authorize(), utilisée notamment dans
// DocumentController pour appliquer DocumentPolicy) doit être réintégré ici
// pour que $this->authorize(...) soit disponible dans tous les contrôleurs
// qui héritent de cette classe.
abstract class Controller
{
    use AuthorizesRequests;
}
