import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { FolderPlus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../Layouts/AppLayout';
import CategoryTree from '../../Components/categories/CategoryTree';
import CategoryFormModal from '../../Components/categories/CategoryFormModal';
import DomaineFormModal from '../../Components/categories/DomaineFormModal';
import { Button } from '../../Components/ui/Button';
import EmptyState from '../../Components/ui/EmptyState';
import ConfirmDialog from '../../Components/ui/Modal';
import { toast } from '../../Components/ui/Toast';

// Catégories et domaines (EF-03). Lecture pour tous ; écriture selon les permissions (props `can`).
export default function Index({ categories = [], can = {} }) {
    const { t } = useTranslation();
    const page = usePage();
    const [categoryModal, setCategoryModal] = useState({ open: false, category: null });
    const [domainModal, setDomainModal] = useState({ open: false, categorie: null, domaine: null });
    const [toDelete, setToDelete] = useState(null); // { kind: 'category' | 'domain', item }
    const [busy, setBusy] = useState(false);

    const askDelete = (kind) => (item) => setToDelete({ kind, item });
    
    const confirmDelete = () => {
        setBusy(true);
        const url = toDelete.kind === 'category' ? `/categories/${toDelete.item.id}` : `/domaines/${toDelete.item.id}`;
        router.delete(url, {
            preserveScroll: true,
            // Suppression refusée par le serveur (rubrique non vide) : message d'erreur en notification.
            onError: (errors) => toast(Object.values(errors)[0] ?? t('errors.generic'), 'error'),
            onFinish: () => { setBusy(false); setToDelete(null); },
        });
    };

    return (
        <AppLayout
            title={t('categories.title')}
            actions={
                can.categories && (
                    <Button onClick={() => setCategoryModal({ open: true, category: null })}>
                        <FolderPlus className="h-4 w-4" aria-hidden="true" /> &nbsp;
                        {t('categories.newCategory')}
                    </Button>
                )
            }
        >
            <p className="-mt-4 mb-6 text-ink-muted">{t('categories.subtitle')}</p>

            {categories.length === 0 ? (
                <EmptyState title={t('categories.empty')} description={can.categories ? t('categories.emptyHintAdmin') : t('categories.emptyHint')} />
            ) : (
                <CategoryTree
                    categories={categories}
                    canCategories={!!can.categories}
                    canDomaines={!!can.domaines}
                    onEditCategory={(category) => setCategoryModal({ open: true, category })}
                    onDeleteCategory={askDelete('category')}
                    onAddDomaine={(categorie) => setDomainModal({ open: true, categorie, domaine: null })}
                    onEditDomaine={(domaine) => setDomainModal({ open: true, categorie: null, domaine })}
                    onDeleteDomaine={askDelete('domain')}
                />
            )}

            <CategoryFormModal open={categoryModal.open} category={categoryModal.category} onClose={() => setCategoryModal((s) => ({ ...s, open: false }))} />
            <DomaineFormModal
                open={domainModal.open}
                categorie={domainModal.categorie}
                domaine={domainModal.domaine}
                categories={categories}
                onClose={() => setDomainModal((s) => ({ ...s, open: false }))}
            />
            <ConfirmDialog
                isOpen={!!toDelete}
                onClose={() => setToDelete(null)}
                title={t('categories.deleteTitle')}
            >
                <div className="space-y-4">
                    <p className="text-sm text-ink-muted">
                        {t('categories.deleteMessage', { name: toDelete?.item?.name })}
                    </p>

                    <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                        <Button type="button" variant="secondary" onClick={() => setToDelete(null)}>
                            {t('common.cancel')}
                        </Button>
                        <Button type="button" variant="danger" onClick={confirmDelete} disabled={busy}>
                            {t('common.delete')}
                        </Button>
                    </div>
                </div>
            </ConfirmDialog>
        </AppLayout>
    );
}