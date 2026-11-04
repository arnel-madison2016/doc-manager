import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/Button';
import { Laptop, Smartphone, ShieldCheck, LogOut } from 'lucide-react';

export default function DevicesList({ sessions = [] }) {
    const { t } = useTranslation();
    const { delete: destroy, processing } = useForm();

    const handleLogoutSession = (sessionId) => {
        destroy(route('profile.sessions.destroy', sessionId), {
            preserveScroll: true,
        });
    };

    return (
        <div className="bg-surface border border-border rounded-lg p-6 space-y-6 shadow-sm">
            <div>
                <h3 className="text-lg font-semibold text-ink flex items-center">
                    <ShieldCheck className="w-5 h-5 mr-2 text-primary-600" />
                    {t('profile.devices.title', 'Appareils et sessions connectés')}
                </h3>
                <p className="text-sm text-ink-muted mt-1">
                    {t('profile.devices.subtitle', 'Gérez et déconnectez vos sessions actives sur d\'autres navigateurs ou appareils.')}
                </p>
            </div>

            <div className="divide-y divide-border">
                {sessions.length === 0 ? (
                    <p className="py-4 text-sm text-ink-muted text-center">
                        {t('profile.devices.no_sessions', 'Aucune autre session active trouvée.')}
                    </p>
                ) : (
                    sessions.map((session, index) => {
                        const isMobile = session.agent?.is_mobile;
                        const Icon = isMobile ? Smartphone : Laptop;

                        return (
                            <div key={index} className="py-4 flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 rounded-md bg-surface-alt border border-border flex items-center justify-center text-ink-muted shrink-0">
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <p className="text-sm font-medium text-ink">
                                                {session.agent?.platform || 'Système inconnu'} - {session.agent?.browser || 'Navigateur inconnu'}
                                            </p>
                                            {session.is_current_device && (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-success-soft text-success rounded-full border border-success/30">
                                                    {t('profile.devices.current', 'Cet appareil')}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-ink-muted mt-0.5">
                                            {session.ip_address} • {t('profile.devices.last_active', 'Dernière activité')} : {session.last_active}
                                        </p>
                                    </div>
                                </div>

                                {!session.is_current_device && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleLogoutSession(session.id)}
                                        disabled={processing}
                                        className="text-danger hover:bg-danger-soft shrink-0"
                                    >
                                        <LogOut className="w-4 h-4 mr-1.5" />
                                        {t('profile.devices.logout', 'Déconnecter')}
                                    </Button>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}