import React from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import Card from '@/Components/ui/Card';
import { FileText, ShieldCheck, Clock, FolderTree } from 'lucide-react';

export default function Dashboard({ auth, stats }) {
    return (
        <AppLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Tableau de bord</h2>}
        >
            <Head title="Tableau de bord" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Statistiques principales */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total Documents</p>
                                <h3 className="text-2xl font-bold">{stats?.total_documents || 0}</h3>
                            </div>
                        </Card>

                        <Card className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Validés (SHA-256)</p>
                                <h3 className="text-2xl font-bold">{stats?.validated_documents || 0}</h3>
                            </div>
                        </Card>

                        <Card className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">En attente</p>
                                <h3 className="text-2xl font-bold">{stats?.pending_documents || 0}</h3>
                            </div>
                        </Card>

                        <Card className="p-6 flex items-center space-x-4">
                            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                                <FolderTree className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Catégories</p>
                                <h3 className="text-2xl font-bold">{stats?.total_categories || 0}</h3>
                            </div>
                        </Card>
                    </div>

                    <Card className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Espace de gestion documentaire</h3>
                        <p className="text-gray-600 text-sm">
                            Accédez à vos dossiers, archivez de nouveaux fichiers et suivez les validations de documents en toute sécurité.
                        </p>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}