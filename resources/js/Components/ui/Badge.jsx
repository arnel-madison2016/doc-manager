import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

const tones = {
    neutral: 'bg-surface-alt text-ink-muted border border-border',
    primary: 'bg-primary-50 text-primary-text',
    success: 'bg-success-soft text-success-text',
    warning: 'bg-warning-soft text-warning-text',
    danger: 'bg-danger-soft text-danger-text',
};

export default function Badge({ tone = 'neutral', className, children }) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                tones[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}

// Statut d'un document (RG-05, diagramme d'états) : brouillon / publié / corbeille.
const statutTone = { brouillon: 'warning', publie: 'success', corbeille: 'danger' };

export function StatusBadge({ statut }) {
    const { t } = useTranslation();
    return <Badge tone={statutTone[statut] ?? 'neutral'}>{t(`documents.statut.${statut}`, statut)}</Badge>;
}