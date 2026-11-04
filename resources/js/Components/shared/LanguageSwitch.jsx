import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { router, usePage } from '@inertiajs/react';
import { Check, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

const NAMES = { fr: 'Français', en: 'English' };

export default function LanguageSwitch({ className }) {
    const { t, i18n } = useTranslation();
    const locales = usePage().props.app?.locales ?? ['fr', 'en'];
    const current = (i18n.language || 'fr').slice(0, 2);

    const choose = (locale) => {
        i18n.changeLanguage(locale);
        router.put('/preferences', { locale }, { preserveState: true, preserveScroll: true, only: ['preferences'] });
    };

    return (
        <Menu as="div" className={cn('relative', className)}>
            <MenuButton
                aria-label={t('language.label')}
                className="inline-flex items-center gap-1.5 rounded-lg p-2 text-sm font-medium text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink"
            >
                <Languages className="h-5 w-5" aria-hidden="true" />
                <span className="uppercase">{current}</span>
            </MenuButton>
            <MenuItems
                anchor="bottom end"
                className="z-50 mt-1 w-40 rounded-lg border border-border bg-surface p-1 shadow-lg focus:outline-none"
            >
                {locales.map((locale) => (
                    <MenuItem key={locale}>
                        <button
                            type="button"
                            onClick={() => choose(locale)}
                            className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm text-ink data-[focus]:bg-surface-alt"
                        >
                            {NAMES[locale] ?? locale.toUpperCase()}
                            {locale === current && <Check className="h-4 w-4 text-primary-text" aria-hidden="true" />}
                        </button>
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}
