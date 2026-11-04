import { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import Modal from '../ui/Modal';

export default function DomaineFormModal({
    open,
    categorie = null,
    domaine = null,
    categories = [],
    onClose,
}) {
    const { t } = useTranslation();
    const isEditing = !!domaine;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        categorie_id: '',
    });

    // Synchronisation des données du formulaire à l'ouverture ou au changement de props
    useEffect(() => {
        if (domaine) {
            setData({
                name: domaine.name || '',
                categorie_id: domaine.categorie_id || categorie?.id || '',
            });
        } else {
            setData({
                name: '',
                categorie_id: categorie?.id || (categories.length > 0 ? categories[0].id : ''),
            });
        }
    }, [domaine, categorie, open]);

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
            put(route('domaines.update', domaine.id), options);
        } else {
            post(route('domaines.store'), options);
        }
    };

    const handleClose = () => {
        reset();
        onClose(); // Ferme la modale sur annulation explicite
    };

    return (
        <Modal
            isOpen={open}
            onClose={handleClose}
            title={isEditing ? t('categories.editDomain', 'Modifier le domaine') : t('categories.addDomain', 'Ajouter un domaine')}
        >
            <form onSubmit={submit} className="space-y-4">
                {/* Sélection de la catégorie rattachée */}
                <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                        {t('categories.fields.category', 'Catégorie')}
                    </label>
                    <select
                        value={data.categorie_id}
                        onChange={(e) => setData('categorie_id', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isEditing} // Généralement verrouillé en édition
                    >
                        <option value="" disabled>
                            {t('categories.selectCategory', 'Sélectionnez une catégorie')}
                        </option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.categorie_id && (
                        <p className="text-xs text-danger mt-1">{errors.categorie_id}</p>
                    )}
                </div>

                {/* Champ du nom du domaine */}
                <div>
                    <label className="block text-sm font-medium text-ink mb-1">
                        {t('categories.fields.name', 'Nom du domaine')}
                    </label>
                    <input
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className="w-full py-2 px-3 text-sm bg-surface-alt border border-border rounded-md text-ink focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder={t('categories.placeholders.domainName', 'Ex: Arrêtés ministériels')}
                        autoFocus
                    />
                    {errors.name && (
                        <p className="text-xs text-danger mt-1">{errors.name}</p>
                    )}
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <Button type="button" variant="secondary" onClick={handleClose}>
                        {t('common.cancel', 'Annuler')}
                    </Button>
                    <Button type="submit" disabled={processing}>
                        {t('common.save', 'Enregistrer')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}