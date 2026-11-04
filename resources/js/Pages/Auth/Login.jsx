import { Link, useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AuthLayout from '@/Layouts/AuthLayout';
import Input from '@/Components/ui/Input';
import {Button} from '@/Components/ui/Button';

export default function Login() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({ email: '', password: '', remember: false });

    const submit = (e) => {
        e.preventDefault();
        post('/login', { onFinish: () => reset('password') });
    };

    return (
        <AuthLayout
            title={t('Sign in')}
            subtitle={t('Enter your login credentials to sign in')}
            footer={
                <>
                    {t('no Account')}{' '}
                    <Link href="/register" className="font-medium text-primary-text hover:underline">
                        {t('register')}
                    </Link>
                </>
            }
        >
            <form onSubmit={submit} className="space-y-4" noValidate>
                <Input
                    label={t('email')}
                    type="email"
                    autoComplete="email"
                    autoFocus
                    required
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    error={errors.email}
                />
                <Input
                    label={t('password')}
                    type="password"
                    autoComplete="current-password"
                    required
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    error={errors.password}
                />
                <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 text-ink">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="h-4 w-4 rounded border-border accent-[var(--color-primary-600)]"
                        />
                        {t('remember')}
                    </label>
                    <Link href="/forgot-password" className="font-medium text-primary-text hover:underline">
                        {t('forgot password ?')}
                    </Link>
                </div>
                <Button type="submit" size="lg" className="w-full" loading={processing}>
                    {t('submit')}
                </Button>
            </form>
        </AuthLayout>
    );
}