import React from 'react';
import { useTranslation } from 'react-i18next';
import Badge  from '@/Components/ui/Badge';
import { FileText, Calendar, Tag, ShieldCheck, Folder } from 'lucide-react';

export default function DocumentMeta({ document }) {
    const { t } = useTranslation();

    const getStatusTone = (statut) => {
        switch (statut) {
            case 'publie': return 'success';
            case 'brouillon': return 'warning';
            case 'corbeille': return 'danger';
            default: return 'neutral';
        }
    };

    return (
        <div className="bg-surface border border-border rounded-lg p-6 space-y-6 shadow-sm">
            <div className="flex items-start justify-between">
                <div>
                    <h2 className="text-xl font-bold text-ink">{document.titre}</h2>
                    <p className="text-xs text-ink-muted mt-1 uppercase tracking-wider">{document.type}</p>
                </div>
                <Badge tone={getStatusTone(document.statut)}>
                    {t(`documents.statut.${document.statut}`, document.statut)}
                </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border text-sm">
                <div className="flex items-center space-x-3 text-ink">
                    <Folder className="w-4 h-4 text-primary-600 shrink-0" />
                    <div>
                        <span className="text-xs text-ink-muted block">{t('documents.meta.category', 'Catégorie')}</span>
                        <span className="font-medium">{document.categorie?.name || '—'}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-ink">
                    <Tag className="w-4 h-4 text-primary-600 shrink-0" />
                    <div>
                        <span className="text-xs text-ink-muted block">{t('documents.meta.domain', 'Domaine')}</span>
                        <span className="font-medium">{document.domaine?.name || '—'}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-ink">
                    <Calendar className="w-4 h-4 text-primary-600 shrink-0" />
                    <div>
                        <span className="text-xs text-ink-muted block">{t('common.created_at', 'Date d\'ajout')}</span>
                        <span className="font-medium">{new Date(document.created_at).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center space-x-3 text-ink">
                    <ShieldCheck className="w-4 h-4 text-success shrink-0" />
                    <div>
                        <span className="text-xs text-ink-muted block">{t('documents.meta.hash', 'Empreinte SHA-256')}</span>
                        <span className="font-mono text-xs truncate max-w-[200px] block" title={document.empreinte}>
                            {document.empreinte || document.empreinte_sha256}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}