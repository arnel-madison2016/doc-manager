import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import Field from '@/Components/ui/Field';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Inscription - GEDoc v2.0">
            <Head title="Inscription" />

            <form onSubmit={submit} className="space-y-4 mt-6">
                <Field label="Nom complet" error={errors.name}>
                    <Input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        autoFocus
                        autoComplete="name"
                    />
                </Field>

                <Field label="Adresse Email" error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                </Field>

                <Field label="Mot de passe" error={errors.password}>
                    <Input
                        type="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        autoComplete="new-password"
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

                <div className="flex items-center justify-between mt-4">
                    <Link
                        href={route('login')}
                        className="text-sm text-gray-600 hover:text-gray-900 underline"
                    >
                        Déjà inscrit ?
                    </Link>

                    <Button type="submit" className="justify-center" disabled={processing}>
                        S'inscrire
                    </Button>
                </div>
            </form>
        </AuthLayout>
    );
}