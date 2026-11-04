import { lazy, Suspense, useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Download, History, Loader2, Pencil, RotateCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../Layouts/AppLayout';
import DocumentMeta from '../../Components/documents/DocumentMeta';
import Alert from '../../Components/ui/Alert';
import Badge from '../../Components/ui/Badge';
import Button from '../../Components/ui/Button';
import { buttonClasses } from '../../Components/ui/buttonClasses';
import Card from '../../Components/ui/Card';
import ConfirmDialog from '../../Components/ui/Modal';

// La visionneuse PDF (pdf.js) est volumineuse : chargée uniquement à l'ouverture d'une fiche.
const PdfViewer = lazy(() => import('../../Components/documents/PdfViewer'));

// Fiche d'un document : aperçu PDF sans téléchargement (UC-03), métadonnées, actions.
export default function Show({ document: d, versions = [], can = {}, retentionDays = 30 }) {
    const { t } = useTranslation();
    const [confirmTrash, setConfirmTrash] = useState(false);
    const [busy, setBusy] = useState(false);
    const inTrash = d.statut === 'corbeille';

    const trash = () => {
        setBusy(true);
        router.delete(`/documents/${d.id}`, { onFinish: () => { setBusy(false); setConfirmTrash(false); } });
    };

    const actions = inTrash ? (
        can.restore && (
            <Button onClick={() => router.post(`/documents/${d.id}/restore`)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                {t('trash.restore')}
            </Button>
        )
    ) : (
        <>
            <a href={`/documents/${d.id}/download`} className={buttonClasses({ variant: 'secondary' })}>
                <Download className="h-4 w-4" aria-hidden="true" />
                {t('documents.show.download')}
            </a>
            {can.update && (
                <Link href={`/documents/${d.id}/edit`} className={buttonClasses({ variant: 'secondary' })}>
                    <Pencil className="h-4 w-4" aria-hidden="true" />
                    {t('documents.show.edit')}
                </Link>
            )}
            <Link href={`/documents/${d.id}/versions`} className={buttonClasses({ variant: 'secondary' })}>
                <History className="h-4 w-4" aria-hidden="true" />
                {t('documents.show.versions')} ({versions.length})
            </Link>
            {can.delete && (
                <Button variant="danger" onClick={() => setConfirmTrash(true)}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                    {t('documents.show.delete')}
                </Button>
            )}
        </>
    );

    return (
        <AppLayout title={d.titre} actions={actions}>
            <div className="-mt-4 mb-6 flex flex-wrap items-center gap-3">
                <Badge statut={d.statut} />
                <Link href="/documents" className="text-sm text-primary-text hover:underline">{t('documents.show.backToList')}</Link>
            </div>

            {inTrash && (
                <Alert tone="warning" className="mb-6">
                    {t('documents.show.inTrash', { days: retentionDays })}
                </Alert>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Suspense
                        fallback={
                            <p className="flex items-center justify-center gap-2 rounded-xl border border-border bg-surface py-16 text-sm text-ink-muted">
                                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                                {t('viewer.loading')}
                            </p>
                        }
                    >
                        <PdfViewer url={`/documents/${d.id}/preview`} />
                    </Suspense>
                </div>
                <Card title={t('documents.show.metadata')}>
                    <DocumentMeta document={d} />
                </Card>
            </div>

            <ConfirmDialog
                open={confirmTrash}
                onClose={() => setConfirmTrash(false)}
                onConfirm={trash}
                loading={busy}
                danger
                title={t('documents.delete.title')}
                message={t('documents.delete.message', { titre: d.titre, days: retentionDays })}
                confirmLabel={t('documents.delete.confirm')}
            />
        </AppLayout>
    );
}
