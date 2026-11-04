import { Pencil, Plus, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Badge from '../ui/Badge';
import { Button } from '../ui/Button';
import Card from '../ui/Card';

// Arborescence catégories > domaines avec compteurs de documents.
// Les actions n'apparaissent que si l'utilisateur possède la permission correspondante (canCategories / canDomaines).
export default function CategoryTree({
    categories = [], canCategories = false, canDomaines = false,
    onEditCategory, onDeleteCategory, onAddDomaine, onEditDomaine, onDeleteDomaine,
}) {
    const { t } = useTranslation();
    const iconBtn = 'inline-flex h-8 w-8 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-alt hover:text-ink disabled:cursor-not-allowed disabled:opacity-40';

    return (
        <div className="grid gap-4 lg:grid-cols-2">
            {categories.map((c) => (
                <Card
                    key={c.id}
                    title={c.name}
                    description={t(c.documents_count > 1 ? 'documents.count_other' : 'documents.count_one', { count: c.documents_count })}
                    actions={
                        <>
                            <Badge tone="primary">{t(`${c.type}`)}</Badge>
                            {canCategories && (
                                <>
                                    <button type="button" className={iconBtn} onClick={() => onEditCategory(c)} aria-label={`${t('common.edit')} ${c.name}`}>
                                        <Pencil className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                    <button
                                        type="button"
                                        className={iconBtn}
                                        onClick={() => onDeleteCategory(c)}
                                        disabled={c.documents_count > 0}
                                        title={c.documents_count > 0 ? t('categories.notEmpty') : undefined}
                                        aria-label={`${t('common.delete')} ${c.name}`}
                                    >
                                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </>
                            )}
                        </>
                    }
                >
                    {c.domaines.length === 0 ? (
                        <p className="text-sm text-ink-muted">{t('categories.noDomains')}</p>
                    ) : (
                        <ul className="divide-y divide-border">
                            {c.domaines.map((d) => (
                                <li key={d.id} className="flex items-center justify-between gap-3 py-2">
                                    <span className="text-sm text-ink font-medium">
                                        {d.name}
                                        <span className="ml-2 text-xs text-ink-muted">
                                            ({t(d.documents_count > 1 ? 'documents.count_other' : 'documents.count_one', { count: d.documents_count })})
                                        </span>
                                    </span>
                                    {canDomaines && (
                                        <span className="flex shrink-0">
                                            <button type="button" className={iconBtn} onClick={() => onEditDomaine({ ...d, categorie_id: c.id })} aria-label={`${t('common.edit')} ${d.name}`}>
                                                <Pencil className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                className={iconBtn}
                                                onClick={() => onDeleteDomaine(d)}
                                                disabled={d.documents_count > 0}
                                                title={d.documents_count > 0 ? t('categories.domainNotEmpty') : undefined}
                                                aria-label={`${t('common.delete')} ${d.name}`}
                                            >
                                                <Trash2 className="h-4 w-4" aria-hidden="true" />
                                            </button>
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    )}
                    {canDomaines && (
                        <div className="mt-3">
                            <Button size="sm" variant="secondary" onClick={() => onAddDomaine(c)}>
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                {t('categories.addDomain')}
                            </Button>
                        </div>
                    )}
                </Card>
            ))}
        </div>
    );
}