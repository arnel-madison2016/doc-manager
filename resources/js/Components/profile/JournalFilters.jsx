import React from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Search, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function JournalFilters({ filters }) {
    const { t } = useTranslation();
    const [action, setAction] = React.useState(filters.action || '');

    const handleFilterChange = (val) => {
        setAction(val);
        router.get(route('journal.index'), { action: val }, { preserveState: true, replace: true });
    };

    const handleReset = () => {
        setAction('');
        router.get(route('journal.index'), {}, { preserveState: true, replace: true });
    };

    return (
        <div className="bg-surface p-4 rounded-lg border border-border flex items-center justify-between gap-4 shadow-sm">
            <div className="w-full max-w-xs">
                <select
                    value={action}
                    onChange={(e) => handleFilterChange(e.target.value)}
                    className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                >
                    <option value="">{t('journal.filters.all_actions', 'Toutes les actions')}</option>
                    <option value="ajout">Ajout</option>
                    <option value="consultation">Consultation</option>
                    <option value="telechargement">Téléchargement</option>
                </select>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-ink-muted">
                <RotateCcw className="w-4 h-4 mr-1.5" />
                {t('common.reset', 'Réinitialiser')}
            </Button>
        </div>
    );
}