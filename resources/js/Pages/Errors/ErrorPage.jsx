import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, FileQuestion, RefreshCw, ServerCrash } from 'lucide-react';

export default function ErrorPage({ status }) {
    const { t } = useTranslation();

    const errors = {
        403: {
            icon: ShieldAlert,
            title: t('errors.403.title', 'Accès refusé'),
            description: t('errors.403.desc', 'Vous n\'avez pas les permissions nécessaires pour accéder à cette ressource.'),
        },
        404: {
            icon: FileQuestion,
            title: t('errors.404.title', 'Page introuvable'),
            description: t('errors.404.desc', 'La page que vous recherchez n\'existe pas ou a été déplacée.'),
        },
        419: {
            icon: RefreshCw,
            title: t('errors.419.title', 'Page expirée'),
            description: t('errors.419.desc', 'Votre session a expiré en raison d\'une inactivité. Veuillez rafraîchir la page.'),
        },
        500: {
            icon: ServerCrash,
            title: t('errors.500.title', 'Erreur serveur'),
            description: t('errors.500.desc', 'Une erreur technique est survenue sur nos serveurs. Nos équipes ont été notifiées.'),
        },
    };

    const current = errors[status] || errors[500];
    const Icon = current.icon;

    return (
        <div className="min-h-screen bg-surface-alt flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-surface border border-border p-8 rounded-xl shadow-sm text-center space-y-4">
                <div className="w-16 h-16 bg-danger-soft text-danger rounded-full flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8" />
                </div>
                <h1 className="text-2xl font-bold text-ink">{current.title}</h1>
                <p className="text-sm text-ink-muted">{current.description}</p>
                <div className="pt-4">
                    <Button onClick={() => window.location.href = '/'}>
                        {t('errors.back_home', 'Retour à l\'accueil')}
                    </Button>
                </div>
            </div>
        </div>
    );
}