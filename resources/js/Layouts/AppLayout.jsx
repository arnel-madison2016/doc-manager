import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { FileText, FolderTree, History, LayoutDashboard, LogOut, Menu as MenuIcon, Search, Settings, Shield, Trash2, User, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Logo from '../Components/shared/Logo';
import ThemeSwitch from '../Components/shared/ThemeSwitch';
import LanguageSwitch from '../Components/shared/LanguageSwitch';
import Toaster from '../Components/ui/Toast';
import { useCan } from '../lib/can';
import { cn } from '../lib/cn';
import { usePreferencesSync } from '../lib/usePreferencesSync';

function Avatar({ user }) {
    if (user?.avatar_path) {
        const avatarUrl = user.avatar_path.startsWith('http') 
            ? user.avatar_path 
            : `/storage/${user.avatar_path}`;
            
        return <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />;
    }

    const initials = (user?.name ?? '?').split(' ').map((s) => s[0]).slice(0, 2).join('').toUpperCase();
    return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
            {initials}
        </span>
    );
}

// Écrans applicatifs : en-tête (recherche, thème, langue, menu utilisateur) + barre latérale.
export default function AppLayout({ title, actions, children }) {
    const { t } = useTranslation();
    const page = usePage();
    const { auth } = page.props;
    const { url } = page;
    const can = useCan();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [query, setQuery] = useState('');
    usePreferencesSync();

    const userRoles = auth?.user?.roles || [];
    // Remplacez 'administrateur' par la valeur exacte stockée dans votre colonne 'name' de la table 'roles'
    const isAdmin = userRoles.includes('administrateur') || userRoles.includes('admin');

    const items = [
        { href: '/dashboard', label: t('Dashboard'), icon: LayoutDashboard },
        { href: '/documents', label: t('Documents'), icon: FileText },        
        { href: '/categories', label: t('Categories'), icon: FolderTree },
        { href: '/journal', label: t('Journal'), icon: History },
        { href: '/documents/corbeille', label: t('Trash'), icon: Trash2 },
        ...(can('utilisateurs.gerer') || can('parametres.gerer')
            ? [{ href: '/admin', label: t('admin.title'), icon: Shield }]
            : []),
    ];

    // L'entrée active est la plus spécifique (ex. /documents/corbeille l'emporte sur /documents).
    const path = url.split('?')[0];
    const activeHref = items
        .filter((i) => (i.href === '/' ? path === '/' : path === i.href || path.startsWith(`${i.href}/`)))
        .sort((a, b) => b.href.length - a.href.length)[0]?.href;

    const search = (e) => {
        e.preventDefault();
        router.get('/documents', query ? { q: query } : {});
    };

    return (
        <div className="min-h-screen bg-surface-alt">
            <Head title={title} />
            <a href="#contenu" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-surface focus:p-2">
                {t('skip')}
            </a>

            {/* Voile mobile */}
            {sidebarOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface transition-transform lg:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex h-16 items-center justify-between px-5">
                    <Logo />
                    <button type="button" className="rounded-lg p-1 text-ink-muted lg:hidden" onClick={() => setSidebarOpen(false)} aria-label={t('common.close')}>
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
                <nav aria-label={t('nav.main')} className="flex-1 space-y-1 px-3 py-2">
                    {items.map(({ href, label, icon: Icon }) => {
                        const active = href === activeHref;
                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? 'page' : undefined}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    active ? 'bg-primary-50 text-primary-text' : 'text-ink-muted hover:bg-surface-alt hover:text-ink',
                                )}
                            >
                                <Icon className="h-5 w-5" aria-hidden="true" />
                                {label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-surface px-4">
                    <button type="button" className="rounded-lg p-2 text-ink-muted hover:bg-surface-alt lg:hidden" onClick={() => setSidebarOpen(true)} aria-label={t('nav.menu')}>
                        <MenuIcon className="h-5 w-5" aria-hidden="true" />
                    </button>

                    <form onSubmit={search} role="search" className="relative hidden max-w-md flex-1 md:block">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" aria-hidden="true" />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('placeholder')}
                            aria-label={t('search')}
                            className="h-10 w-full rounded-lg border border-border bg-surface-alt pl-9 pr-3 text-sm text-ink placeholder:text-ink-muted"
                        />
                    </form>

                    <div className="ml-auto flex items-center gap-1">
                        <LanguageSwitch />
                        <ThemeSwitch />
                        <Menu as="div" className="relative ml-1">
                            <MenuButton className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-surface-alt" aria-label={t('user.account')}>
                                <Avatar user={auth?.user} />
                                <span className="hidden text-sm font-medium text-ink sm:block">{auth?.user?.name}</span>
                            </MenuButton>
                            <MenuItems anchor="bottom end" className="z-50 mt-1 w-56 rounded-lg border border-border bg-surface p-1 shadow-lg focus:outline-none">
                                <div className="px-3 py-2 text-xs text-ink-muted">{auth?.user?.email}</div>
                                <MenuItem>
                                    <Link href="/profil" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink data-[focus]:bg-surface-alt">
                                        <User className="h-4 w-4" aria-hidden="true" /> {t('Profile')}
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <Link href="/parametres" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-ink data-[focus]:bg-surface-alt">
                                        <Settings className="h-4 w-4" aria-hidden="true" /> {t('Settings')}
                                    </Link>
                                </MenuItem>
                                <MenuItem>
                                    <button
                                        type="button"
                                        onClick={() => router.post('/logout')}
                                        className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger-text data-[focus]:bg-surface-alt"
                                    >
                                        <LogOut className="h-4 w-4" aria-hidden="true" /> {t('Logout')}
                                    </button>
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </header>

                <main id="contenu" className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6">
                    {(title || actions) && (
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            {title && <h1 className="text-2xl font-bold text-ink">{title}</h1>}
                            {actions && <div className="flex items-center gap-2">{actions}</div>}
                        </div>
                    )}
                    {children}
                </main>
            </div>
            <Toaster />
        </div>
    );
}