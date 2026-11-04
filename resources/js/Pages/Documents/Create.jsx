import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../Layouts/AppLayout';
import DocumentForm from '../../Components/documents/DocumentForm';
import DuplicateAlert from '../../Components/documents/DuplicateAlert';

// Ajout d'un document PDF (UC-01, EF-04, EF-05). Un doublon (empreinte SHA-256) revient du serveur
// sous forme d'erreurs de formulaire : fichier, duplicate_of, duplicate_titre.
export default function Create({ categories = [], maxUploadMb = 50, initialType = 'texte_administratif' }) {
    const { t } = useTranslation();
    const form = useForm({
        type: initialType, fichier: null, titre: '', description: '', categorie_id: '', domaine_id: '',
        numero_acte: '', type_acte: '', autorite_emettrice: '', date_signature: '',
        auteur: '', editeur: '', isbn: '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.post('/documents', { forceFormData: true, preserveScroll: true });
    };

    return (
        <AppLayout title={t('documents.create.title')}>
            <div className="mx-auto max-w-3xl">
                <p className="-mt-4 mb-6 text-ink-muted">{t('documents.create.subtitle')}</p>
                <DocumentForm
                    form={form}
                    categories={categories}
                    mode="create"
                    maxMb={maxUploadMb}
                    onSubmit={submit}
                    submitLabel={t('documents.create.submit')}
                    cancelHref="/documents"
                >
                    {form.errors.duplicate_of && <DuplicateAlert id={form.errors.duplicate_of} titre={form.errors.duplicate_titre} />}
                </DocumentForm>
            </div>
        </AppLayout>
    );
}
