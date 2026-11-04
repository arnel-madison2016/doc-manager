import React from 'react';
import { useTranslation } from 'react-i18next';
import { AlertTriangle, ExternalLink } from 'lucide-react';

export default function DuplicateAlert({ existingDocument }) {
    const { t } = useTranslation();

    if (!existingDocument) return null;

    return (
        <div className="bg-warning-soft border border-warning text-warning-text p-4 rounded-lg flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
                <p className="font-semibold">{t('documents.errors.duplicate_title', 'Doublon détecté')}</p>
                <p className="mt-1">
                    {t('documents.errors.duplicate_desc', 'Un document identique existe déjà dans vos dossiers :')}
                </p>
                <div className="mt-2">
                    <a
                        href={route('documents.show', existingDocument.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center font-medium underline hover:text-warning"
                    >
                        {existingDocument.titre}
                        <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                </div>
            </div>
        </div>
    );
}