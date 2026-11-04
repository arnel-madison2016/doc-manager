import React from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';

export function PasswordForm() {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('profile.password'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4 bg-surface p-6 rounded-lg border border-border shadow-sm">
            <h3 className="text-lg font-semibold text-ink mb-4"
            >
                {t('profile.password.title', 'Sécurité')}
            </h3>

            <Input
                label={t('profile.password.current', 'Mot de passe actuel')}
                type="password"
                value={data.current_password}
                onChange={(e) => setData('current_password', e.target.value)}
                error={errors.current_password}
                required
            />
            <Input
                label={t('profile.password.new', 'Nouveau mot de passe')}
                type="password"
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                error={errors.password}
                required
            />
            <Input
                label={t('profile.password.confirm', 'Confirmation')}
                type="password"
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                error={errors.password_confirmation}
                required
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={processing}>{t('common.save', 'Enregistrer')}</Button>
            </div>
        </form>
    );
}