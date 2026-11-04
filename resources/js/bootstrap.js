import axios from 'axios';
window.axios = axios;

// Indique à Laravel/Axios que les requêtes proviennent d'une application AJAX/SPA
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Configuration automatique du jeton CSRF pour sécuriser les requêtes POST, PUT, DELETE
let token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    window.axios.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('Jeton CSRF introuvable : assurez-vous que la balise meta csrf-token est présente dans votre layout Blade.');
}