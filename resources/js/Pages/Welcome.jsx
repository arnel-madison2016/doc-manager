import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, FileText, Lock, ArrowRight, CheckCircle2, FolderTree, History } from 'lucide-react';
import { Button } from '../Components/ui/Button';

export default function Welcome({ canLogin, canRegister }) {
    const { t } = useTranslation();

    const features = [
        {
            icon: ShieldCheck,
            title: t('welcome.features.security.title', 'Intégrité SHA-256'),
            description: t('welcome.features.security.desc', 'Vérification cryptographique de chaque document pour garantir l\'absence de falsification et détecter instantanément les doublons.'),
        },
        {
            icon: Lock,
            title: t('welcome.features.gdpr.title', 'Conformité RGPD'),
            description: t('welcome.features.gdpr.desc', 'Gestion rigoureuse des données personnelles, droit à l\'oubli, export complet des données et révocation des sessions à distance.'),
        },
        {
            icon: FolderTree,
            title: t('welcome.features.structure.title', 'Classement modulaire'),
            description: t('welcome.features.structure.desc', 'Organisation claire par catégories, domaines et types de documents administratifs ou personnels.'),
        },
        {
            icon: History,
            title: t('welcome.features.audit.title', 'Journalisation & Audit'),
            description: t('welcome.features.audit.desc', 'Traçabilité complète de toutes les actions (consultations, téléchargements, ajouts) pour un contrôle total de l\'activité.'),
        },
    ];

    return (
        <div className="min-h-screen bg-surface-alt flex flex-col justify-between text-ink">
            <Head title={t('welcome.title', 'Bienvenue sur GEDoc')} />

            {/* En-tête / Barre de navigation */}
            <header className="bg-surface border-b border-border sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl font-extrabold text-primary-600 tracking-tight">GEDoc v2.0</span>
                    </div>
                    <div className="flex items-center space-x-3">
                        {canLogin && (
                            <Link href={route('login')}>
                                <Button variant="ghost" size="sm">
                                    {t('auth.login', 'Connexion')}
                                </Button>
                            </Link>
                        )}
                        {canRegister && (
                            <Link href={route('register')}>
                                <Button size="sm">
                                    {t('auth.register', 'Inscription')}
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Section Héro */}
            <main className="flex-1">
                <section className="max-w-7xl mx-auto px-6 py-20 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-600 border border-primary-200">
                            {t('welcome.badge', 'Gestion Électronique Sécurisée')}
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                            {t('welcome.hero.title', 'Simplifiez et sécurisez la gestion de vos documents.')}
                        </h1>
                        <p className="text-lg text-ink-muted">
                            {t('welcome.hero.subtitle', 'Une plateforme moderne propulsée par Laravel et React pour archiver, classer, valider et auditer vos documents en toute sérénité.')}
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
                            {canRegister && (
                                <Link href={route('register')}>
                                    <Button size="lg" className="w-full sm:w-auto">
                                        {t('welcome.hero.cta_start', 'Commencer gratuitement')}
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            )}
                            {canLogin && (
                                <Link href={route('login')}>
                                    <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                                        {t('welcome.hero.cta_login', 'Accéder à mon espace')}
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>

                    <div className="bg-surface border border-border rounded-2xl p-8 shadow-xl relative">
                        <div className="space-y-4">
                            <div className="flex items-center space-x-3 pb-4 border-b border-border">
                                <div className="w-3 h-3 rounded-full bg-danger"></div>
                                <div className="w-3 h-3 rounded-full bg-warning"></div>
                                <div className="w-3 h-3 rounded-full bg-success"></div>
                                <span className="text-xs text-ink-muted font-mono ml-2">gedoc.app/secure-storage</span>
                            </div>
                            <div className="space-y-3 py-2">
                                <div className="h-10 bg-surface-alt rounded-md flex items-center px-4 text-xs font-medium text-ink">
                                    📁 Rapport_Financier_2026.pdf (Validé SHA-256)
                                </div>
                                <div className="h-10 bg-surface-alt rounded-md flex items-center px-4 text-xs font-medium text-ink">
                                    📁 Contrat_Prestataire_Signé.pdf (Sécurisé)
                                </div>
                                <div className="h-10 bg-surface-alt rounded-md flex items-center px-4 text-xs font-medium text-ink">
                                    📁 Acte_Administratif_Officiel.pdf (Publié)
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section Fonctionnalités */}
                <section className="bg-surface border-t border-border py-20">
                    <div className="max-w-7xl mx-auto px-6 space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-3">
                            <h2 className="text-3xl font-bold tracking-tight">
                                {t('welcome.features.heading', 'Conçu pour la sécurité et la performance')}
                            </h2>
                            <p className="text-sm text-ink-muted">
                                {t('welcome.features.subheading', 'Découvrez les piliers technologiques qui font de GEDoc l\'outil idéal pour vos besoins documentaires.')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {features.map((feat, index) => {
                                const Icon = feat.icon;
                                return (
                                    <div key={index} className="bg-surface-alt border border-border rounded-xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="w-12 h-12 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-base font-semibold">{feat.title}</h3>
                                        <p className="text-xs text-ink-muted leading-relaxed">{feat.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Pied de page */}
            <footer className="bg-surface border-t border-border py-8 text-center text-xs text-ink-muted">
                <p>&copy; {new Date().getFullYear()} GEDoc v2.0. {t('welcome.footer.rights', 'Tous droits réservés.')}</p>
            </footer>
        </div>
    );
}