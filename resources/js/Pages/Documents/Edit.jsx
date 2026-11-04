import { useForm } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import AppLayout from '../../Layouts/AppLayout';
import DocumentForm from '../../Components/documents/DocumentForm';

// Modification des métadonnées (le type et le fichier ne changent pas : RG-08 ; nouvelle version : écran Versions).
export default function Edit({ document: d, categories = [] }) {
    const { t } = useTranslation();
    const form = useForm({
        type: d.type,
        titre: d.titre ?? '',
        description: d.description ?? '',
        categorie_id: String(d.categorie_id ?? ''),
        domaine_id: String(d.domaine_id ?? ''),
        numero_acte: d.numero_acte ?? '',
        type_acte: d.type_acte ?? '',
        autorite_emettrice: d.autorite_emettrice ?? '',
        date_signature: d.date_signature ?? '',
        auteur: d.auteur ?? '',
        editeur: d.editeur ?? '',
        isbn: d.isbn ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        form.put(`/documents/${d.id}`, { preserveScroll: true });
    };

    return (
        <AppLayout title={t('documents.edit.title')}>
            <div className="mx-auto max-w-3xl">
                <p className="-mt-4 mb-6 text-ink-muted">{d.titre}</p>
                <DocumentForm
                    form={form}
                    categories={categories}
                    mode="edit"
                    onSubmit={submit}
                    submitLabel={t('documents.edit.submit')}
                    cancelHref={`/documents/${d.id}`}
                />
            </div>
        </AppLayout>
    );
}
