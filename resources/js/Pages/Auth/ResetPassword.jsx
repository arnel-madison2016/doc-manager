import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import Field from '@/Components/ui/Field';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Réinitialisation du mot de passe - GEDoc v2.0">
            <Head title="Réinitialisation du mot de passe" />

            <form onSubmit={submit} className="space-y-4">
                <Field label="Adresse Email" error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                </Field>

                <Field label="Nouveau mot de passe" error={errors.password}>
                    <Input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="new-password"
                        autoFocus
                    />
                </Field>

                <Field label="Confirmer le mot de passe" error={errors.password_confirmation}>
                    <Input
                        type="password"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                        autoComplete="new-password"
                    />
                </Field>

                <Button type="submit" className="w-full justify-center" disabled={processing}>
                    Réinitialiser le mot de passe
                </Button>
            </form>
        </AuthLayout>
    );
}