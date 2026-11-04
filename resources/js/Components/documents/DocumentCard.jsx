import { Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { StatusBadge } from '../ui/Badge';
import { useFormatters } from '../../lib/format';


// Sous-titre d'un document : « Décret · n° 2024-118 » pour un acte, auteur pour un livre.
export function documentSubtitle(d, t) {
    if (d.type === 'texte_administratif') {
        return [d.type_acte ? t(`documents.typeActe.${d.type_acte}`) : null, d.numero_acte ? `n° ${d.numero_acte}` : null]
            .filter(Boolean)
            .join(' · ');
    }
    return d.auteur ?? '';
}

// Vue « cartes » de la liste des documents.
export default function DocumentCard({ document: d }) {
    const { t } = useTranslation();
    const f = useFormatters();
    const subtitle = documentSubtitle(d, t);

    return (
        <Link
            href={`/documents/${d.id}`}
            className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 shadow-sm transition-colors hover:border-primary-500"
        >
            <div className="mb-3 flex items-start justify-between gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-text">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                </span>
                <StatusBadge statut={d.statut} />
            </div>
            <h3 className="line-clamp-2 font-semibold text-ink group-hover:text-primary-text">{d.titre}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-ink-muted">{subtitle}</p>}
            <p className="mt-2 text-xs text-ink-muted">
                {[d.categorie?.name, d.domaine?.name].filter(Boolean).join(' › ')}
            </p>
            <p className="mt-auto pt-3 text-xs text-ink-muted">
                {f.date(d.date_signature ?? d.created_at)}
                {d.taille != null && ` · ${f.size(d.taille)}`}
            </p>
        </Link>
    );
}