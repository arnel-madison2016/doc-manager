import { Link } from '@inertiajs/react';
import { BookOpen, ScrollText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button, { buttonClasses } from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';
import FileDropzone from '../shared/FileDropzone';
import { cn } from '../../lib/cn';

const TYPES = [
    { value: 'texte_administratif', icon: ScrollText, categorie: 'administratif' },
    { value: 'livre_personnel', icon: BookOpen, categorie: 'personnel' },
];

// Nom de fichier → titre proposé : « decret_2024-118.pdf » devient « decret 2024-118 ».
const titleFromFilename = (name) => name.replace(/\.pdf$/i, '').replace(/[_]+/g, ' ').trim();

/**
 * Formulaire d'ajout et d'édition d'un document.
 * - form : objet retourné par useForm (data, setData, errors, processing, progress)
 * - mode : 'create' (choix du type + fichier) | 'edit' (type immuable, RG-08)
 */
export default function DocumentForm({ form, categories = [], mode = 'create', maxMb = 50, onSubmit, submitLabel, cancelHref, children }) {
    const { t } = useTranslation();
    const { data, setData, errors, processing, progress } = form;
    const acte = data.type === 'texte_administratif';
    const typeCategorie = acte ? 'texte_administratif' : 'livre_personnel';

    const categoriesOfType = categories.filter((c) => c.type === typeCategorie);
    const domaines = categories.find((c) => String(c.id) === String(data.categorie_id))?.domaines ?? [];

    const changeType = (type) => setData({ ...data, type, categorie_id: '', domaine_id: '' });
    const changeFile = (file) => {
        // Pré-remplit le titre depuis le nom du fichier, sans écraser une saisie existante.
        setData({ ...data, fichier: file, titre: file && !data.titre ? titleFromFilename(file.name) : data.titre });
    };

    return (
        <form onSubmit={onSubmit} className="space-y-6" noValidate>
            {children}

            {mode === 'create' ? (
                <Card title={t('documents.create.typeLabel')}>
                    <div role="radiogroup" aria-label={t('documents.create.typeLabel')} className="grid gap-3 sm:grid-cols-2">
                        {TYPES.map(({ value, icon: Icon }) => {
                            const active = data.type === value;
                            return (
                                <button
                                    key={value}
                                    type="button"
                                    role="radio"
                                    aria-checked={active}
                                    onClick={() => changeType(value)}
                                    className={cn(
                                        'flex items-start gap-3 rounded-lg border p-4 text-left transition-colors',
                                        active ? 'border-primary-600 bg-primary-50' : 'border-border bg-surface hover:bg-surface-alt',
                                    )}
                                >
                                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-primary-text" aria-hidden="true" />
                                    <span>
                                        <span className="block text-sm font-semibold text-ink">{t(`documents.type.${value}`)}</span>
                                        <span className="block text-xs text-ink-muted">{t(`documents.create.typeHint.${value}`)}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Card>
            ) : (
                <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-ink-muted">
                    <span className="font-medium text-ink">{t(`documents.type.${data.type}`)}</span> — {t('documents.edit.typeFixed')}
                </p>
            )}

            {mode === 'create' && (
                <Card title={t('documents.fields.file')}>
                    <FileDropzone
                        value={data.fichier}
                        onChange={changeFile}
                        error={errors.fichier}
                        maxMb={maxMb}
                        progress={processing && progress ? progress.percentage : null}
                        disabled={processing}
                    />
                </Card>
            )}

            <Card title={t('documents.create.general')}>
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="md:col-span-2">
                        <Input label={t('documents.fields.title')} required value={data.titre} onChange={(e) => setData('titre', e.target.value)} error={errors.titre} />
                    </div>
                    <Select
                        label={t('documents.fields.category')}
                        required
                        value={String(data.categorie_id ?? '')}
                        onChange={(e) => setData({ ...data, categorie_id: e.target.value, domaine_id: '' })}
                        placeholder={t('documents.create.selectCategory')}
                        options={categoriesOfType.map((c) => ({ value: String(c.id), label: c.name }))}
                        error={errors.categorie_id}
                    />
                    <Select
                        label={t('documents.fields.domain')}
                        value={String(data.domaine_id ?? '')}
                        onChange={(e) => setData('domaine_id', e.target.value)}
                        disabled={!data.categorie_id}
                        placeholder={t('documents.create.noDomain')}
                        options={domaines.map((d) => ({ value: String(d.id), label: d.name }))}
                        error={errors.domaine_id}
                    />
                    <div className="md:col-span-2">
                        <Textarea label={t('documents.fields.description')} value={data.description} onChange={(e) => setData('description', e.target.value)} error={errors.description} />
                    </div>
                </div>
            </Card>

            <Card title={acte ? t('documents.create.actInfo') : t('documents.create.bookInfo')}>
                {acte ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input label={t('documents.fields.numeroActe')} required value={data.numero_acte} onChange={(e) => setData('numero_acte', e.target.value)} error={errors.numero_acte} />
                        <Select
                            label={t('documents.fields.typeActe')}
                            required
                            value={data.type_acte ?? ''}
                            onChange={(e) => setData('type_acte', e.target.value)}
                            placeholder={t('documents.create.selectTypeActe')}
                            options={['decret', 'arrete', 'decision'].map((k) => ({ value: k, label: t(`documents.typeActe.${k}`) }))}
                            error={errors.type_acte}
                        />
                        <Input label={t('documents.fields.authority')} required value={data.autorite_emettrice} onChange={(e) => setData('autorite_emettrice', e.target.value)} error={errors.autorite_emettrice} />
                        <Input label={t('documents.fields.signatureDate')} type="date" required value={data.date_signature} onChange={(e) => setData('date_signature', e.target.value)} error={errors.date_signature} />
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        <Input label={t('documents.fields.author')} required value={data.auteur} onChange={(e) => setData('auteur', e.target.value)} error={errors.auteur} />
                        <Input label={t('documents.fields.publisher')} value={data.editeur} onChange={(e) => setData('editeur', e.target.value)} error={errors.editeur} />
                        <Input label={t('documents.fields.isbn')} value={data.isbn} onChange={(e) => setData('isbn', e.target.value)} error={errors.isbn} />
                    </div>
                )}
            </Card>

            <div className="flex flex-wrap justify-end gap-2">
                {cancelHref && (
                    <Link href={cancelHref} className={buttonClasses({ variant: 'secondary' })}>
                        {t('common.cancel')}
                    </Link>
                )}
                <Button type="submit" loading={processing}>
                    {submitLabel}
                </Button>
            </div>
        </form>
    );
}