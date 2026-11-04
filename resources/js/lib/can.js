import { usePage } from '@inertiajs/react';

// Retourne une fonction can('permission') basée sur les permissions Spatie partagées (auth.permissions).
export function useCan() {

    const { auth } = usePage().props;
    const permissions = auth?.user?.permissions || [];

    return (permissionName) => {
        return permissions.includes(permissionName);
    };
}
