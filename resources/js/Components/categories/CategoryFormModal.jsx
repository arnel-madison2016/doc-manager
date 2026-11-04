import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import Modal from '../ui/Modal';

export default function CategoryFormModal({ open, category = null, onClose }) {
    const { t } = useTranslation();
    const isEditing = !!category;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        type: 'texte_administratif',
    });

    // Met à jour les champs du formulaire lorsque la catégorie change ou que la modale s'ouvre
    useEffect(() => {
        if (category) {
            setData({
                name: category.name || '',
                type: category.type || 'texte_administratif',
            });
        } else {
            reset();
        }
    }, [category, open]);

    const submit = (e) => {
        e.preventDefault();
        
        const options = {
            onSuccess: () => {
                reset();
                onClose(); // Ferme la modale uniquement en cas de succès
            },
            preserveScroll: true,
        };

        if (isEditing) {
            put(route('categories.update', category.id), options);
        } else {
            post(route('categories.store'), options);
        }
    };

    const handleClose = () => {
        reset();
        onClose(); // Ferme la modale sur annulation explicite
    };

    return (
        <Modal isOpen={open} onClose={handleClose} title={isEditing ? t('categories.editCategory') : t('categories.newCategory')}>
            <form onSubmit={submit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                        {t('categories.fields.name')}
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Nom de la catégorie"
                        autoFocus
                    />
                    {errors.name && <p className="text-xs text-danger mt-1">{errors.name}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                        {t('categories.fields.type')}
                    </label>
                    <select
                        value={data.type}
                        onChange={(e) => setData('type', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="texte_administratif">{t('categories.type.administratif')}</option>
                        <option value="livre_personnel">{t('categories.type.personnel')}</option>
                        <option value="autre">{t('categories.type.autre')}</option>
                    </select>
                    {errors.type && <p className="text-xs text-danger mt-1">{errors.type}</p>}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        {t('common.cancel')}
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {t('common.save')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}