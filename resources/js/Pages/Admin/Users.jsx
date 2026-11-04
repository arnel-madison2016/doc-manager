import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/layouts/AppLayout';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import UserCreateModal from '@/components/admin/UserCreateModal';
import { UserPlus, Download, Shield } from 'lucide-react';

export default function Users({ users, filters }) {
    const { t } = useTranslation();
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const updateRole = (userId, newRole) => {
        router.put(route('admin.users.role', userId), { role: newRole }, { preserveScroll: true });
    };

    const columns = [
        { header: t('common.name'), accessor: 'nom' },
        { header: t('common.email'), accessor: 'email' },
        { 
            header: t('admin.users.role'), 
            cell: (row) => (
                <select
                    defaultValue={row.roles[0]?.name || 'utilisateur'}
                    onChange={(e) => updateRole(row.id, e.target.value)}
                    className="text-xs py-1 px-2 bg-surface-alt border border-border rounded-md text-ink"
                >
                    <option value="utilisateur">Utilisateur</option>
                    <option value="administrateur">Administrateur</option>
                </select>
            ) 
        },
        { header: t('admin.users.documents_count'), accessor: 'documents_count' },
        { 
            header: t('common.actions'), 
            cell: (row) => (
                <a
                    href={route('admin.users.export', row.id)}
                    className="p-1.5 text-ink-muted hover:text-primary-600 inline-flex items-center"
                    title={t('admin.users.export_gdpr')}
                >
                    <Download className="w-4 h-4" />
                </a>
            ) 
        },
    ];

    return (
        <AppLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-ink">{t('admin.users.title')}</h1>
                        <p className="text-sm text-ink-muted">{t('admin.users.subtitle')}</p>
                    </div>
                    <Button onClick={() => setIsCreateOpen(true)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {t('admin.users.new')}
                    </Button>
                </div>

                <DataTable columns={columns} rows={users.data} links={users.links} />

                <UserCreateModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
            </div>
        </AppLayout>
    );
}