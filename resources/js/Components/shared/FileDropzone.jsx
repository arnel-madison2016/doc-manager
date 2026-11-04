import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function FileDropzone({ value, onChange, error }) {
    const { t } = useTranslation();
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onChange(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            onChange(e.target.files[0]);
        }
    };

    return (
        <div className="space-y-1">
            <label className="block text-sm font-medium text-ink">{t('documents.form.file', 'Fichier PDF')}</label>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                    isDragging ? 'border-primary-600 bg-primary-50/50' : 'border-border bg-surface-alt hover:border-primary-500'
                }`}
            >
                {value ? (
                    <div className="flex items-center justify-between bg-surface p-3 rounded-md border border-border">
                        <div className="flex items-center space-x-3 truncate">
                            <FileText className="w-5 h-5 text-primary-600 shrink-0" />
                            <span className="text-sm font-medium text-ink truncate">{value.name}</span>
                        </div>
                        <button
                            type="button"
                            onClick={() => onChange(null)}
                            className="p-1 text-ink-muted hover:text-danger rounded transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <UploadCloud className="w-10 h-10 mx-auto text-ink-muted" />
                        <div className="text-sm text-ink">
                            <label htmlFor="file-upload" className="font-semibold text-primary-600 hover:underline cursor-pointer">
                                {t('documents.dropzone.browse', 'Cliquez pour parcourir')}
                            </label>
                            <span className="text-ink-muted"> {t('documents.dropzone.or_drag', 'ou glissez-déposez votre fichier ici')}</span>
                        </div>
                        <p className="text-xs text-ink-muted">PDF (Max. 50 Mo)</p>
                        <input
                            id="file-upload"
                            type="file"
                            accept="application/pdf"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </div>
                )}
            </div>
            {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>
    );
}