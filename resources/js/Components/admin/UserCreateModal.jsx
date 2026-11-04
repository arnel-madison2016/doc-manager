import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function UserCreateModal({ isOpen, onClose }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        role: 'utilisateur',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'), {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t('admin.users.create_title')}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label={t('common.name')}
                    value={data.nom}
                    onChange={(e) => setData('name', e.target.value)}
                    error={errors.name}
                    required
                />
                <Input
                    label={t('common.email')}
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                    required
                />
                <div>
                    <label className="block text-sm font-medium text-ink mb-1">{t('admin.users.role')}</label>
                    <select
                        value={data.role}
                        onChange={(e) => setData('role', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink"
                    >
                        <option value="utilisateur">Utilisateur</option>
                        <option value="administrateur">Administrateur</option>
                    </select>
                    {errors.role && <p className="text-xs text-danger mt-1">{errors.role}</p>}
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                    <Button type="button" variant="ghost" onClick={onClose}>{t('common.cancel')}</Button>
                    <Button type="submit" disabled={processing}>{t('common.save')}</Button>
                </div>
            </form>
        </Modal>
    );
}