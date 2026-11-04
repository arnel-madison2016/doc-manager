import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/Button';
import { Settings } from 'lucide-react';

export default function PreferencesForm({ preferences }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors } = useForm({
        theme: preferences.theme || 'clair',
        locale: preferences.locale || 'fr',
        per_page: preferences.per_page || 20,
        vue_documents: preferences.vue_documents || 'tableau',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('settings.update'), { preserveScroll: true });
    };

    return (
        <form onSubmit={submit} className="bg-surface border border-border rounded-lg p-6 space-y-6 shadow-sm">
            <div>
                <h3 className="text-lg font-semibold text-ink flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-primary-600" />
                    {t('settings.title', 'Préférences de l\'interface')}
                </h3>
                <p className="text-sm text-ink-muted mt-1">
                    {t('settings.subtitle', 'Personnalisez votre affichage et vos options de navigation.')}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t('settings.theme', 'Thème de l\'interface')}</label>
                    <select
                        value={data.theme}
                        onChange={(e) => setData('theme', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                    >
                        <option value="clair">Clair</option>
                        <option value="sombre">Sombre</option>
                        <option value="auto">Automatique (système)</option>
                    </select>
                    {errors.theme && <p className="text-xs text-danger mt-1">{errors.theme}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t('settings.locale', 'Langue')}</label>
                    <select
                        value={data.locale}
                        onChange={(e) => setData('locale', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                    >
                        <option value="fr">Français</option>
                        <option value="en">English</option>
                    </select>
                    {errors.locale && <p className="text-xs text-danger mt-1">{errors.locale}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t('settings.per_page', 'Lignes par page')}</label>
                    <select
                        value={data.per_page}
                        onChange={(e) => setData('per_page', Number(e.target.value))}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    {errors.per_page && <p className="text-xs text-danger mt-1">{errors.per_page}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t('settings.default_view', 'Vue par défaut des documents')}</label>
                    <select
                        value={data.vue_documents}
                        onChange={(e) => setData('vue_documents', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                    >
                        <option value="tableau">Tableau</option>
                        <option value="cartes">Cartes</option>
                    </select>
                    {errors.vue_documents && <p className="text-xs text-danger mt-1">{errors.vue_documents}</p>}
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
                <Button type="submit" disabled={processing}>
                    {t('common.save', 'Enregistrer les modifications')}
                </Button>
            </div>
        </form>
    );
}