import React from 'react';
import { useTranslation } from 'react-i18next';

export function RecentActivity({ activities = [] }) {
    const { t } = useTranslation();

    return (
        <div className="bg-surface border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b border-border bg-surface-alt">
                <h3 className="text-base font-semibold text-ink">{t('admin.dashboard.recent_activity', 'Activité récente')}</h3>
            </div>
            <div className="divide-y divide-border">
                {activities.length === 0 ? (
                    <p className="p-4 text-sm text-ink-muted text-center">{t('common.no_data', 'Aucune activité récente.')}</p>
                ) : (
                    activities.map((act) => (
                        <div key={act.id} className="p-4 flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-3">
                                <span className="font-medium text-ink">{act.user?.name || 'Utilisateur'}</span>
                                <span className="text-ink-muted">({act.action})</span>
                            </div>
                            <span className="text-xs text-ink-muted">
                                {new Date(act.created_at).toLocaleString()}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}