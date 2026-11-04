import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthLayout from '@/Layouts/AuthLayout';
import { Button } from '@/Components/ui/Button';
import Input from '@/Components/ui/Input';
import Field from '@/Components/ui/Field';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <AuthLayout title="Mot de passe oublié - GEDoc v2.0">
            <Head title="Mot de passe oublié" />

            <div className="mb-4 text-sm text-gray-600">
                Mot de passe oublié ? Indiquez votre adresse email pour recevoir un lien de réinitialisation.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-4">
                <Field label="Adresse Email" error={errors.email}>
                    <Input
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoFocus
                    />
                </Field>

                <Button type="submit" className="w-full justify-center" disabled={processing}>
                    Envoyer le lien de réinitialisation
                </Button>
            </form>
        </AuthLayout>
    );
}