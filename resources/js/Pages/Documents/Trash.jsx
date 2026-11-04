import { Link, router } from '@inertiajs/react';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import { documentSubtitle } from '../../components/documents/DocumentCard';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import Button, { buttonClasses } from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { useFormatters } from '../../lib/format';

// Corbeille (RG-05) : documents supprimés, délai restant avant la purge définitive, restauration.
export default function Trash({ documents, retentionDays = 30 }) {
    const { t } = useTranslation();
    const f = useFormatters();
    const rows = documents.data ?? [];

    const columns = [
        {
            key: 'titre',
            header: t('documents.columns.title'),
            render: (d) => (
                <div className="min-w-0">
                    <Link href={`/documents/${d.id}`} className="font-medium text-primary-text hover:underline">{d.titre}</Link>
                    {documentSubtitle(d, t) && <p className="text-xs text-ink-muted">{documentSubtitle(d, t)}</p>}
                </div>
            ),
        },
        { key: 'categorie', header: t('documents.columns.category'), render: (d) => d.categorie?.nom ?? '—' },
        { key: 'corbeille_at', header: t('trash.deletedOn'), render: (d) => f.date(d.corbeille_at) },
        {
            key: 'purge',
            header: t('trash.purge'),
            render: (d) => <Badge tone={d.purge_in_days <= 7 ? 'danger' : 'neutral'}>{t('trash.remaining', { count: d.purge_in_days })}</Badge>,
        },
        {
            key: 'actions',
            header: <span className="sr-only">{t('common.actions')}</span>,
            className: 'text-right',
            render: (d) => (
                <Button size="sm" variant="secondary" onClick={() => router.post(`/documents/${d.id}/restore`, {}, { preserveScroll: true })}>
                    <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    {t('trash.restore')}
                </Button>
            ),
        },
    ];

    return (
        <AppLayout
            title={t('trash.title')}
            actions={
                <Link href="/documents" className={buttonClasses({ variant: 'secondary' })}>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {t('nav.documents')}
                </Link>
            }
        >
            <div className="space-y-4">
                <Alert tone="info">{t('trash.info', { days: retentionDays })}</Alert>
                {rows.length === 0 ? (
                    <EmptyState icon={Trash2} title={t('trash.empty')} />
                ) : (
                    <DataTable columns={columns} rows={rows} caption={t('trash.title')} />
                )}
                <Pagination links={documents.links} />
            </div>
        </AppLayout>
    );
}
