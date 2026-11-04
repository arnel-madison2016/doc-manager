import { useState } from 'react';
import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../layouts/AppLayout';
import VersionList from '../../components/documents/VersionList';
import FileDropzone from '../../components/shared/FileDropzone';
import Button, { buttonClasses } from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { ConfirmDialog } from '../../components/ui/Modal';

// Historique des versions et dépôt d'une nouvelle version (UC-02, EF-10, EF-11, RG-04).
export default function Versions({ document: d, versions = [], can = {}, maxUploadMb = 50 }) {
    const { t } = useTranslation();
    const [target, setTarget] = useState(null);
    const [busy, setBusy] = useState(false);
    const { data, setData, post, processing, progress, errors, reset } = useForm({ fichier: null });

    const upload = (e) => {
        e.preventDefault();
        post(`/documents/${d.id}/versions`, { forceFormData: true, preserveScroll: true, onSuccess: () => reset() });
    };

    const restore = () => {
        setBusy(true);
        router.post(`/documents/${d.id}/versions/${target.id}/restore`, {}, {
            preserveScroll: true,
            onFinish: () => { setBusy(false); setTarget(null); },
        });
    };

    return (
        <AppLayout
            title={t('versions.title', { titre: d.titre })}
            actions={
                <Link href={`/documents/${d.id}`} className={buttonClasses({ variant: 'secondary' })}>
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    {t('versions.back')}
                </Link>
            }
        >
            <div className="space-y-6">
                <VersionList documentId={d.id} versions={versions} canUpdate={can.update} onRestore={setTarget} />

                {can.update && (
                    <Card title={t('versions.upload')} description={t('versions.uploadHint')}>
                        <form onSubmit={upload} className="space-y-4" noValidate>
                            <FileDropzone
                                file={data.fichier}
                                onChange={(f) => setData('fichier', f)}
                                error={errors.fichier}
                                maxMb={maxUploadMb}
                                progress={processing && progress ? progress.percentage : null}
                                disabled={processing}
                            />
                            <div className="flex justify-end">
                                <Button type="submit" loading={processing} disabled={!data.fichier}>{t('versions.submit')}</Button>
                            </div>
                        </form>
                    </Card>
                )}
            </div>

            <ConfirmDialog
                open={!!target}
                onClose={() => setTarget(null)}
                onConfirm={restore}
                loading={busy}
                title={t('versions.restoreTitle', { n: target?.numero_version })}
                message={t('versions.restoreMessage')}
                confirmLabel={t('versions.confirmRestore')}
            />
        </AppLayout>
    );
}
