import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';

export default function Settings({ settings }) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('apparence');

    const { data, setData, put, processing, errors } = useForm({
        section: activeTab,
        theme_defaut: settings.theme_defaut || 'clair',
        theme_forcer: settings.theme_forcer || false,
        couleur_primaire: settings.couleur_primaire || 'gedoc',
        nom_application: settings.nom_application || 'GEDoc',
        langue_defaut: settings.langue_defaut || 'fr',
        langues_disponibles: settings.langues_disponibles || ['fr', 'en'],
        corbeille_retention_jours: settings.corbeille_retention_jours || 30,
        upload_taille_max_mo: settings.upload_taille_max_mo || 50,
        vue_documents_defaut: settings.vue_documents_defaut || 'tableau',
        lignes_par_page_defaut: settings.lignes_par_page_defaut || 20,
        inscription_ouverte: settings.inscription_ouverte ?? true,
        journal_retention_jours: settings.journal_retention_jours || 365,
        maintenance_actif: settings.maintenance_actif || false,
        maintenance_message: settings.maintenance_message || { fr: '', en: '' },
    });

    const submit = (e) => {
        e.preventDefault();
        data.section = activeTab;
        put(route('admin.settings.update'), { preserveScroll: true });
    };

    return (
        <AppLayout>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-2xl font-bold text-ink">{t('admin.settings.title')}</h1>
                    <p className="text-sm text-ink-muted">{t('admin.settings.subtitle')}</p>
                </div>

                <div className="flex space-x-2 border-b border-border">
                    {['apparence', 'langue', 'documents', 'securite'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                                activeTab === tab ? 'border-primary-600 text-primary-600' : 'border-transparent text-ink-muted hover:text-ink'
                            }`}
                        >
                            {t(`admin.settings.tabs.${tab}`)}
                        </button>
                    ))}
                </div>

                <form onSubmit={submit} className="bg-surface p-6 rounded-lg border border-border space-y-6 shadow-sm">
                    {activeTab === 'apparence' && (
                        <div className="space-y-4">
                            <Input
                                label={t('admin.settings.app_name')}
                                value={data.nom_application}
                                onChange={(e) => setData('nom_application', e.target.value)}
                                error={errors.nom_application}
                            />
                            <div>
                                <label className="block text-sm font-medium text-ink mb-1">{t('admin.settings.default_theme')}</label>
                                <select
                                    value={data.theme_defaut}
                                    onChange={(e) => setData('theme_defaut', e.target.value)}
                                    className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                                >
                                    <option value="clair">Clair</option>
                                    <option value="sombre">Sombre</option>
                                    <option value="auto">Automatique (système)</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'langue' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-ink mb-1">{t('admin.settings.default_locale')}</label>
                                <select
                                    value={data.langue_defaut}
                                    onChange={(e) => setData('langue_defaut', e.target.value)}
                                    className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                                >
                                    <option value="fr">Français</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-4">
                            <Input
                                label={t('admin.settings.trash_retention')}
                                type="number"
                                value={data.corbeille_retention_jours}
                                onChange={(e) => setData('corbeille_retention_jours', e.target.value)}
                                error={errors.corbeille_retention_jours}
                            />
                            <Input
                                label={t('admin.settings.max_upload_size')}
                                type="number"
                                value={data.upload_taille_max_mo}
                                onChange={(e) => setData('upload_taille_max_mo', e.target.value)}
                                error={errors.upload_taille_max_mo}
                            />
                        </div>
                    )}

                    {activeTab === 'securite' && (
                        <div className="space-y-4">
                            <label className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={data.inscription_ouverte}
                                    onChange={(e) => setData('inscription_ouverte', e.target.checked)}
                                    className="rounded border-border text-primary-600 focus:ring-primary-500"
                                />
                                <span className="text-sm font-medium text-ink">{t('admin.settings.registration_open')}</span>
                            </label>
                        </div>
                    )}

                    <div className="flex justify-end pt-4 border-t border-border">
                        <Button type="submit" disabled={processing}>{t('common.save')}</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}