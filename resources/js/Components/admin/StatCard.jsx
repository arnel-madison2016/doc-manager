import React from 'react';
import { useTranslation } from 'react-i18next';

export function StatCard({ title, value, icon: Icon, description }) {
    return (
        <div className="bg-surface p-6 rounded-lg border border-border shadow-sm flex items-center justify-between">
            <div>
                <p className="text-xs font-medium text-ink-muted uppercase tracking-wider">{title}</p>
                <p className="text-2xl font-bold text-ink mt-1">{value}</p>
                {description && <p className="text-xs text-ink-muted mt-1">{description}</p>}
            </div>
            {Icon && (
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6" />
                </div>
            )}
        </div>
    );
}