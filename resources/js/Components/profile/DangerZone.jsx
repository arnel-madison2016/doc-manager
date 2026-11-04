import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import { Modal } from '@/Components/ui/Modal';
import { AlertTriangle, Download, Trash2 } from 'lucide-react';

export default function DangerZone() {
    const { t } = useTranslation();
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const { data, setData, delete: destroy, processing, errors, reset } = useForm({
        password: '',
    });

    const handleDeleteAccount = (e) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            onSuccess: () => reset(),
        });
    };

    const handleExport = () => {
        window.location.href = route('profile.export');
    };

    return (
        <div className="bg-surface border border-danger/30 rounded-lg p-6 space-y-6 shadow-sm">
            <div>
                <h3 className="text-lg font-semibold text-danger flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    {t('profile.danger.title', 'Zone de danger & RGPD')}
                </h3>
                <p className="text-sm text-ink-muted mt-1">
                    {t('profile.danger.subtitle', 'Exportez l\'ensemble de vos données personnelles ou supprimez définitivement votre compte de manière irréversible.')}
                </p>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                <div>
                    <h4 className="text-sm font-medium text-ink">{t('profile.danger.export_title', 'Exporter mes données')}</h4>
                    <p className="text-xs text-ink-muted">{t('profile.danger.export_desc', 'Téléchargez une archive JSON contenant votre profil, vos préférences et vos métadonnées.')}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-1.5" />
                    {t('profile.danger.export_action', 'Exporter')}
                </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4 border-t border-border">
                <div>
                    <h4 className="text-sm font-medium text-danger">{t('profile.danger.delete_title', 'Supprimer mon compte')}</h4>
                    <p className="text-xs text-ink-muted">{t('profile.danger.delete_desc', 'Supprime définitivement votre compte, vos documents et vos fichiers associés.')}</p>
                </div>
                <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)}>
                    <Trash2 className="w-4 h-4 mr-1.5" />
                    {t('profile.danger.delete_action', 'Supprimer le compte')}
                </Button>
            </div>

            {/* Modale de confirmation de suppression */}
            <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title={t('profile.danger.modal_title', 'Confirmer la suppression du compte')}>
                <form onSubmit={handleDeleteAccount} className="space-y-4">
                    <p className="text-sm text-ink-muted">
                        {t('profile.danger.modal_warning', 'Cette action est irréversible. Veuillez saisir votre mot de passe actuel pour confirmer.')}
                    </p>
                    <Input
                        label={t('profile.password.current', 'Mot de passe actuel')}
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        error={errors.password}
                        required
                    />
                    <div className="flex justify-end space-x-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setIsDeleteOpen(false)}>
                            {t('common.cancel', 'Annuler')}
                        </Button>
                        <Button type="submit" variant="danger" disabled={processing}>
                            {t('profile.danger.confirm_delete', 'Confirmer la suppression')}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}