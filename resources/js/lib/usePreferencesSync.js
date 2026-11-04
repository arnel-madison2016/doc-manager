import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../theme/ThemeProvider';

// Aligne la langue et le thème de l'interface sur les préférences connues du serveur
// (profil de l'utilisateur ou session), après connexion ou changement de page.
export function usePreferencesSync() {
    const { preferences } = usePage().props;
    const { i18n } = useTranslation();
    const { syncFromServer } = useTheme();

    useEffect(() => {
        const locale = preferences?.locale;
        if (locale && (i18n.language || '').slice(0, 2) !== locale) i18n.changeLanguage(locale);
    }, [preferences?.locale]);

    useEffect(() => {
        if (preferences?.theme) syncFromServer(preferences.theme);
    }, [preferences?.theme]);
}
