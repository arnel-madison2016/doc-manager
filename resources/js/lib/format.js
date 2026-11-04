import { useTranslation } from 'react-i18next';

// Une date « YYYY-MM-DD » est lue en heure locale (évite le décalage d'un jour lié à l'UTC).
const parse = (v) => (typeof v === 'string' && v.length === 10 ? new Date(`${v}T00:00:00`) : new Date(v));

export function formatDate(value, locale = 'fr', options = { dateStyle: 'medium' }) {
    if (!value) return '—';
    const d = parse(value);
    return Number.isNaN(d.getTime()) ? '—' : new Intl.DateTimeFormat(locale, options).format(d);
}

export const formatDateTime = (value, locale = 'fr') =>
    formatDate(value, locale, { dateStyle: 'medium', timeStyle: 'short' });

export function formatFileSize(bytes, locale = 'fr') {
    if (bytes === null || bytes === undefined) return '—';
    const units = locale.startsWith('fr') ? ['o', 'Ko', 'Mo', 'Go'] : ['B', 'KB', 'MB', 'GB'];
    let value = Number(bytes);
    let i = 0;
    while (value >= 1024 && i < units.length - 1) {
        value /= 1024;
        i += 1;
    }
    const nf = new Intl.NumberFormat(locale, { maximumFractionDigits: i === 0 ? 0 : 1 });
    return `${nf.format(value)} ${units[i]}`;
}

// Formateurs liés à la langue active de l'interface.
export function useFormatters() {
    const { i18n } = useTranslation();
    const locale = (i18n.language || 'fr').slice(0, 2);
    return {
        locale,
        date: (v, o) => formatDate(v, locale, o),
        dateTime: (v) => formatDateTime(v, locale),
        size: (b) => formatFileSize(b, locale),
    };
}


