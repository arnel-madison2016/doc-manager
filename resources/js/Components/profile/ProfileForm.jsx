import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {Badge} from '../ui/Badge';
import {Button} from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

// Informations du profil (EF-02) : nom et e-mail ; les rôles sont affichés en lecture seule.
export default function ProfileForm({ profile }) {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors, isDirty } = useForm({ name: profile.name ?? '', email: profile.email ?? '' });

    const submit = (e) => {
        e.preventDefault();
        put('/profil', { preserveScroll: true });
    };

    return (
        <Card title={t('profile.info.title', 'Informations')} description={t('profile.info.description', 'Vos informations personnelles')}>
            <form onSubmit={submit} className="space-y-4" noValidate>
                <div className="grid gap-4 md:grid-cols-2">
                    <Input label={t('auth.register.name', 'Nom')} required value={data.name} onChange={(e) => setData('name', e.target.value)} error={errors.name} autoComplete="name" />
                    <Input label={t('auth.email', 'Email')} type="email" required value={data.email} onChange={(e) => setData('email', e.target.value)} error={errors.email} autoComplete="email" />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="flex items-center gap-2 text-sm text-ink-muted">
                        {t('profile.info.roles', 'Role')}
                        {(profile.roles ?? []).map((r) => (
                            <Badge key={r} tone="primary">{t(`roles.${r}`, r)}</Badge>
                        ))}
                    </p>
                    <Button type="submit" loading={processing} disabled={!isDirty}>{t('common.save', 'Sauvegarder')}</Button>
                </div>
            </form>
        </Card>
    );
}
