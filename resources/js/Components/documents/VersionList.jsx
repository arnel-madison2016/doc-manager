import React from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { History, Download, RotateCcw, Eye } from 'lucide-react';

export default function VersionList({ document }) {
    const { t } = useTranslation();

    const restoreVersion = (versionId) => {
        if (confirm(t('documents.versions.confirm_restore'))) {
            router.post(route('documents.versions.restore', [document.id, versionId]));
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-ink flex items-center">
                <History className="w-5 h-5 mr-2 text-primary-600" />
                {t('documents.versions.title')}
            </h3>

            <div className="divide-y divide-border border border-border rounded-lg bg-surface">
                {document.versions.map((version) => (
                    <div key={version.id} className="p-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-ink">
                                        {t('documents.versions.number', { numero: version.numero })}
                                    </span>
                                    {version.is_active && (
                                        <Badge tone="success">{t('documents.versions.active')}</Badge>
                                    )}
                                </div>
                                <p className="text-xs text-ink-muted mt-0.5">
                                    {new Date(version.created_at).toLocaleDateString()} — {(version.taille / 1024 / 1024).toFixed(2)} Mo
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <a
                                href={route('documents.preview', [document.id, { version: version.id }])}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-ink-muted hover:text-primary-600 rounded-md hover:bg-surface-alt transition-colors"
                                title={t('common.preview')}
                            >
                                <Eye className="w-4 h-4" />
                            </a>
                            <a
                                href={route('documents.download', [document.id, { version: version.id }])}
                                className="p-2 text-ink-muted hover:text-primary-600 rounded-md hover:bg-surface-alt transition-colors"
                                title={t('common.download')}
                            >
                                <Download className="w-4 h-4" />
                            </a>
                            {!version.is_active && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => restoreVersion(version.id)}
                                    title={t('documents.versions.restore_action')}
                                >
                                    <RotateCcw className="w-4 h-4 text-primary-600" />
                                </Button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}