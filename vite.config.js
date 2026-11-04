import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // 1. Importer le plugin
import path from 'path';

export default defineConfig({
    plugins: [
        tailwindcss(), // 2. Activer le plugin Tailwind avant Laravel
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
        
    ],
    resolve: {
        alias: {
            // Remplacement de __dirname par import.meta.dirname
            '@': path.resolve(import.meta.dirname, './resources/js'),
        },
    },
});
