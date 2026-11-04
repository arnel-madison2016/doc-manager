import { router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';

export const LOCALE_NAMES = { fr: 'Français', en: 'English' };

// Langue active, langues disponibles (paramètre global) et changement persistant (session / profil).
export function useLocale() {
    const { i18n } = useTranslation();
    const locales = usePage().props.app?.locales ?? ['fr', 'en'];
    const locale = (i18n.language || 'fr').slice(0, 2);

    const setLocale = (next) => {
        i18n.changeLanguage(next);
        router.put('/preferences', { locale: next }, { preserveState: true, preserveScroll: true, only: ['preferences'] });
    };

    return { locale, locales, setLocale };
}
