import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import fr from './locales/fr/translation.json';
import en from './locales/en/translation.json';

export const SUPPORTED_LOCALES = ['fr', 'en'];

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { fr: { translation: fr }, en: { translation: en } },
        fallbackLng: 'fr', // langue par défaut (Dossier frontend §5.2)
        supportedLngs: SUPPORTED_LOCALES,
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',
        interpolation: { escapeValue: false },
        // Priorité (§5.3) : préférence serveur (appliquée par usePreferencesSync) > cache local > navigateur.
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'gedoc-locale',
        },
    });

const syncHtmlLang = (lng) => {
    document.documentElement.lang = (lng || 'fr').slice(0, 2);
};
syncHtmlLang(i18n.language);
i18n.on('languageChanged', syncHtmlLang);

export default i18n;