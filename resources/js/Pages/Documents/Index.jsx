import { Link, router, usePage } from '@inertiajs/react';
import { Download, FilePlus2, LayoutGrid, List, Search, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../Layouts/AppLayout';
import DocumentCard, { documentSubtitle } from '../../Components/documents/DocumentCard';
import DocumentFilters from '../../Components/documents/DocumentFilters';
import { StatusBadge } from '../../Components/ui/Badge';
import Button from '@/Components/ui/Button';
import { buttonClasses } from '../../Components/ui/buttonClasses';
import DataTable from '../../Components/ui/DataTable';
import EmptyState from '../../Components/ui/EmptyState';
import { Pagination } from '../../Components/ui/Pagination';
import { useFormatters } from '../../lib/format';
import { useLocalStorage } from '../../lib/useLocalStorage';
import { cn } from '../../lib/cn';

// Liste et recherche des documents (EF-06, EF-07) : vue tableau ou cartes, filtres, pagination.
export default function Index({ documents, filters = {}, categories = [] }) {
    
    const { t } = useTranslation();
    const f = useFormatters();
    const defaultView = usePage().props.app?.settings?.vue_documents_defaut ?? 'tableau';
    const [view, setView] = useLocalStorage('gedoc-documents-view', defaultView);
    const rows = documents.data ?? [];
    const filtered = Object.values(filters).some((v) => v !== null && v !== '' && v !== undefined);

    const iconLink = 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-alt hover:text-ink';
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
        {
            key: 'categorie',
            header: t('documents.columns.category'),
            render: (d) => [d.categorie?.name, d.domaine?.name].filter(Boolean).join(' › '),
        },
        { key: 'date', header: t('documents.columns.date'), render: (d) => f.date(d.date_signature ?? d.created_at) },
        { key: 'statut', header: t('documents.columns.status'), render: (d) => <StatusBadge statut={d.statut} /> },
        { 
            key: 'version', 
            header: t('documents.columns.version'),
            className: 'text-center', 
            render: (d) => (d.version_active ? `v${d.version_active}` : ' — ') 
        },
        { key: 'taille', header: t('documents.columns.taille'), render: (d) => (d.taille ? `${f.size(d.taille)}` : ' — ') },
        {
            key: 'actions',
            header: <span className="sr-only">{t('common.actions')}</span>,
            className: 'text-center',
            render: (d) => (
                <a href={`/documents/${d.id}/download`} className={iconLink} aria-label={`${t('documents.show.download')} — ${d.titre}`} title={t('documents.show.download')}>
                    <Download className="h-4 w-4" aria-hidden="true" />
                </a>
            ),
        },
    ];

    const toggle = (value, Icon) => (
        <button
            type="button"
            role="radio"
            aria-checked={view === value}
            onClick={() => setView(value)}
            aria-label={t(`documents.view.${value}`)}
            title={t(`documents.view.${value}`)}
            className={cn('inline-flex h-8 w-8 items-center justify-center rounded-md', view === value ? 'bg-primary-600 text-white' : 'text-ink-muted hover:text-ink')}
        >
            <Icon className="h-4 w-4" aria-hidden="true" />
        </button>
    );

    return (
        <AppLayout
            title={t('documents.title')}
            actions={
                <>
                    <Link href="/documents/corbeille" className={buttonClasses({ variant: 'secondary' })}>
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        {t('nav.trash')}
                    </Link>
                    <Link href="/documents/create" className={buttonClasses()}>
                        <FilePlus2 className="h-4 w-4" aria-hidden="true" />
                        {t('documents.add')}
                    </Link>
                </>
            }
        >
            <div className="space-y-4">
                <DocumentFilters filters={filters} categories={categories} />

                <div className="flex items-center justify-between">
                    <p className="text-sm text-ink-muted" aria-live="polite">{t('documents.count', { count: documents.total ?? rows.length })}</p>
                    <div role="radiogroup" aria-label={t('documents.view.label')} className="inline-flex rounded-lg border border-border bg-surface p-1">
                        {toggle('tableau', List)}
                        {toggle('cartes', LayoutGrid)}
                    </div>
                </div>

                {rows.length === 0 ? (
                    <EmptyState
                        icon={Search}
                        title={filtered ? t('documents.emptyFiltered') : t('documents.empty')}
                        description={filtered ? t('documents.emptyFilteredHint') : t('documents.emptyHint')}
                        action={
                            filtered ? (
                                <Button type="button" onClick={() => router.get('/documents')} className={buttonClasses({ variant: 'secondary' })}>
                                    {t('documents.filters.reset')}
                                </Button>
                            ) : (
                                <Link href="/documents/create" className={buttonClasses()}>{t('documents.add')}</Link>
                            )
                        }
                    />
                ) : view === 'cartes' ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {rows.map((d) => <DocumentCard key={d.id} document={d} />)}
                    </div>
                ) : (
                    <DataTable columns={columns} rows={rows} caption={t('documents.title')} />
                )}

                <Pagination links={documents.links} />
            </div>
        </AppLayout>
    );
}
