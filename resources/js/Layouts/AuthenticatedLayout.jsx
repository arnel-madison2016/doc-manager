import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { 
    LayoutDashboard, 
    FileText, 
    FolderTree, 
    ShieldAlert, 
    Settings, 
    LogOut, 
    Menu, 
    X,
    User,
    History
} from 'lucide-react';
import FlashMessage from '@/components/ui/FlashMessage';

export default function AuthenticatedLayout({ children }) {
    const { t } = useTranslation();
    const { auth } = usePage().props;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const user = auth.user;
    const isAdmin = user?.roles?.some(role => role.name === 'admin') || user?.is_admin;

    const navigation = [
        { name: t('nav.dashboard', 'Tableau de bord'), href: route('dashboard'), icon: LayoutDashboard, active: route().current('dashboard') },
        { name: t('nav.documents', 'Documents'), href: route('documents.index'), icon: FileText, active: route().current('documents.*') },
        { name: t('nav.categories', 'Catégories & Domaines'), href: route('categories.index'), icon: FolderTree, active: route().current('categories.*') || route().current('domaines.*') },
        { name: t('nav.journal', 'Journal d\'activité'), href: route('journal.index'), icon: History, active: route().current('journal.*') },
        { name: t('nav.profile', 'Mon profil'), href: route('profile.edit'), icon: User, active: route().current('profile.*') },
        { name: t('nav.settings', 'Paramètres'), href: route('settings.edit'), icon: Settings, active: route().current('settings.*') },
    ];

    if (isAdmin) {
        navigation.push({
            name: t('nav.admin', 'Administration'),
            href: route('admin.dashboard'),
            icon: ShieldAlert,
            active: route().current('admin.*')
        });
    }

    return (
        <div className="min-h-screen bg-surface-alt flex flex-col">
            {/* Notifications Flash */}
            <FlashMessage />

            <div className="flex flex-1">
                {/* Sidebar Mobile Overlay */}
                {sidebarOpen && (
                    <div 
                        className="fixed inset-0 z-40 bg-ink/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar Navigation */}
                <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                    <div className="h-16 flex items-center justify-between px-6 border-b border-border">
                        <span className="text-xl font-bold text-primary-600 tracking-wider">GEDoc v2.0</span>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-1 text-ink-muted hover:text-ink"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <nav className="p-4 space-y-1">
                        {navigation.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        item.active
                                            ? 'bg-primary-50 text-primary-600'
                                            : 'text-ink-muted hover:bg-surface-alt hover:text-ink'
                                    }`}
                                >
                                    <Icon className="w-5 h-5 shrink-0" />
                                    <span>{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-surface">
                        <div className="flex items-center justify-between mb-3 px-2">
                            <div className="truncate">
                                <p className="text-sm font-medium text-ink truncate">{user.nom || user.name}</p>
                                <p className="text-xs text-ink-muted truncate">{user.email}</p>
                            </div>
                        </div>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-danger bg-danger-soft/50 hover:bg-danger-soft rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span>{t('auth.logout', 'Déconnexion')}</span>
                        </Link>
                    </div>
                </aside>

                {/* Contenu Principal */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header Supérieur */}
                    <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-6 sticky top-0 z-30">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-ink-muted hover:text-ink focus:outline-none"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="flex items-center space-x-4 ml-auto">
                            <span className="text-sm font-medium text-ink">{user.nom || user.name}</span>
                        </div>
                    </header>

                    {/* Zone de contenu de la page */}
                    <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}