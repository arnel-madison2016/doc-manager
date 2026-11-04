import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import Logo from '../Components/shared/Logo';
import ThemeSwitch from '../Components/shared/ThemeSwitch';
import LanguageSwitch from '../Components/shared/LanguageSwitch';
import Toaster from '../Components/ui/Toast';
import { usePreferencesSync } from '../lib/usePreferencesSync';

// Écrans publics (connexion, inscription, mot de passe oublié) : carte centrée, sans menu.
export default function AuthLayout({ title, subtitle, children, footer }) {
    const { t } = useTranslation();
    usePreferencesSync();

    return (
        <div className="flex min-h-screen flex-col bg-surface-alt">
            <Head title={title} />
            <header className="flex items-center justify-between px-6 py-4">
                <Logo href="/login" />
                <div className="flex items-center gap-1">
                    <LanguageSwitch />
                    <ThemeSwitch />
                </div>
            </header>

            <main className="flex flex-1 items-center justify-center px-4 pb-12">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm">
                        <h1 className="text-2xl font-bold text-ink">{title}</h1>
                        {subtitle && <p className="mt-1 mb-6 text-sm text-ink-muted">{subtitle}</p>}
                        {children}
                    </div>
                    {footer && <p className="mt-4 text-center text-sm text-ink-muted">{footer}</p>}
                </div>
            </main>

            <p className="pb-6 text-center text-xs text-ink-muted">{t('app.tagline')}</p>
            <Toaster />
        </div>
    );
}