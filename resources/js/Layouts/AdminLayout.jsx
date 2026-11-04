import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from './AppLayout';
import { useCan } from '../lib/can';
import { cn } from '../lib/cn';

// Étend AppLayout avec la navigation par onglets du tableau de bord administrateur (Dossier §6.4).
export default function AdminLayout({ title, actions, children }) {
    const { t } = useTranslation();
    const { url } = usePage();
    const can = useCan();

    const tabs = [
        { href: '/admin', key: 'overview', perm: 'utilisateurs.gerer' },
        { href: '/admin/utilisateurs', key: 'users', perm: 'utilisateurs.gerer' },
        { href: '/categories', key: 'categories', perm: 'categories.gerer' },
        { href: '/admin/parametres?onglet=apparence', key: 'appearance', perm: 'parametres.gerer' },
        { href: '/admin/parametres?onglet=langue', key: 'language', perm: 'parametres.gerer' },
        { href: '/admin/parametres?onglet=documents', key: 'documents', perm: 'parametres.gerer' },
        { href: '/admin/parametres?onglet=securite', key: 'security', perm: 'parametres.gerer' },
    ].filter((tab) => can(tab.perm));

    return (
        <AppLayout title={title ?? t('admin.title')} actions={actions}>
            <nav aria-label={t('admin.tabsLabel')} className="mb-6 flex gap-1 overflow-x-auto border-b border-border">
                {tabs.map((tab) => {
                    const active = url === tab.href || (!tab.href.includes('?') && url.split('?')[0] === tab.href);
                    return (
                        <Link
                            key={tab.key}
                            href={tab.href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
                                active ? 'border-primary-600 text-primary-text' : 'border-transparent text-ink-muted hover:text-ink',
                            )}
                        >
                            {t(`admin.tabs.${tab.key}`)}
                        </Link>
                    );
                })}
            </nav>
            {children}
        </AppLayout>
    );
}