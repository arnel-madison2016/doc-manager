//
import './bootstrap';
import '../css/app.css';
import './i18n';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ThemeProvider from './theme/ThemeProvider';
import { route } from 'ziggy-js';

// Rendre 'route' accessible globalement dans l'application
window.route = route;

createInertiaApp({
    // Correction du titre de l'application pour GEDoc v2.0
    title: (title) => title ? `${title} - GEDoc v2.0` : 'GEDoc v2.0',

    // Correction du chemin des dossiers : './Pages/**/*.jsx' au lieu de './pages/**/*.jsx'
    resolve: (name) =>
        resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
        
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider initial={props.initialPage.props.preferences?.theme}>
                <App {...props} />
            </ThemeProvider>
        );
    },

    progress: {
        color: '#4B5563',
    },
});