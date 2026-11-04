import React from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Search, RotateCcw } from 'lucide-react';
import Button from '@/Components/ui/Button';

export default function DocumentFilters({ filters, categories }) {
    const { t } = useTranslation();

    const [values, setValues] = React.useState({
        q: filters.q || '',
        type: filters.type || '',
        categorie_id: filters.categorie_id || '',
        domaine_id: filters.domaine_id || '',
        tri: filters.tri || 'date_desc',
    });

    const handleChange = (name, value) => {
        const updated = { ...values, [name]: value };
        setValues(updated);
        router.get(route('documents.index'), updated, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setValues({ q: '', type: '', categorie_id: '', domaine_id: '', tri: 'date_desc' });
        router.get(route('documents.index'), {}, { preserveState: true, replace: true });
    };

    return (
        <div className="bg-surface p-4 rounded-lg border border-border space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Recherche textuelle */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 w-4 h-4 text-ink-muted" />
                    <input
                        type="text"
                        value={values.q}
                        onChange={(e) => handleChange('q', e.target.value)}
                        placeholder={t('documents.filters.search_placeholder')}
                        className="w-full pl-9 pr-4 py-2 text-sm bg-surface-alt border border-border rounded-md text-ink focus:outline-none focus:ring-1 focus:ring-primary-500"
                    />
                </div>

                {/* Type de document */}
                <select
                    value={values.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                >
                    <option value="">{t('documents.filters.all_types')}</option>
                    <option value="texte_administratif">{t('documents.types.administratif')}</option>
                    <option value="livre_personnel">{t('documents.types.personnel')}</option>
                    <option value="autre">{t('documents.types.autre')}</option>
                </select>

                {/* Tri */}
                <select
                    value={values.tri}
                    onChange={(e) => handleChange('tri', e.target.value)}
                    className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                >
                    <option value="date_desc">{t('documents.sort.date_desc')}</option>
                    <option value="date_asc">{t('documents.sort.date_asc')}</option>
                    <option value="titre_asc">{t('documents.sort.titre_asc')}</option>
                    <option value="titre_desc">{t('documents.sort.titre_desc')}</option>
                </select>

                <div className="flex items-center justify-end">
                    <Button variant="ghost" size="sm" onClick={handleReset} className="text-ink-muted">
                        <RotateCcw className="w-4 h-4 mr-1.5" />
                        {t('common.reset')}
                    </Button>
                </div>
            </div>
        </div>
    );
}