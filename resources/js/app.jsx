//
import './bootstrap';
import '../css/app.css';
import './i18n';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from './theme/ThemeProvider';

createInertiaApp({
    // Détermine le titre de la page basé sur le titre du composant
    title: (title) => title ? `${title} - Herby-Garage` : 'Herby-Garage',

    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.jsx`, import.meta.glob('./pages/**/*.jsx')),
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider initial={props.initialPage.props.preferences?.theme}>
                <App {...props} />
            </ThemeProvider>
        );
    },

    // Optionnel: Gère le chargement progressif des pages
    progress: {
        color: '#4B5563', // Couleur de la barre de progression
    },
});