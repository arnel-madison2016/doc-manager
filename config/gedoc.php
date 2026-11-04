<?php

return [
    'defaults' => [
        'theme_defaut' => 'clair',
        'theme_forcer' => false,
        'couleur_primaire' => 'gedoc',
        'nom_application' => 'GEDoc',
        'logo_path' => null,
        'maintenance_actif' => false,
        'maintenance_message' => ['fr' => 'Maintenance en cours.', 'en' => 'Maintenance in progress.'],
        'langue_defaut' => 'fr',
        'langues_disponibles' => ['fr', 'en'],
        'corbeille_retention_jours' => 30,
        'upload_taille_max_mo' => 50,
        'doublons_politique' => 'refuser',
        'vue_documents_defaut' => 'tableau',
        'lignes_par_page_defaut' => 20,
        'inscription_ouverte' => true,
        'journal_retention_jours' => 365,
    ],

    'palettes' => [
        'gedoc' => [
            '500' => '#2E6BE6', '600' => '#1F54C4', '700' => '#163E92',
            'texte_clair' => '#1F54C4', 'texte_sombre' => '#8DB2FF'
        ],
        'indigo' => [
            '500' => '#6366F1', '600' => '#4F46E5', '700' => '#4338CA',
            'texte_clair' => '#4338CA', 'texte_sombre' => '#A5B4FC'
        ],
        'cyan' => [
            '500' => '#0891B2', '600' => '#0E7490', '700' => '#155E75',
            'texte_clair' => '#0E7490', 'texte_sombre' => '#67E8F9'
        ],
        'azur' => [
            '500' => '#0284C7', '600' => '#0369A1', '700' => '#075985',
            'texte_clair' => '#0369A1', 'texte_sombre' => '#7DD3FC'
        ],
        'marine' => [
            '500' => '#2563EB', '600' => '#1E40AF', '700' => '#1E3A8A',
            'texte_clair' => '#1E40AF', 'texte_sombre' => '#93C5FD'
        ],
    ],
];