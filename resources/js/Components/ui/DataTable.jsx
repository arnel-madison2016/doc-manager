import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

/**
 * columns : [{ key, header, render?: (row) => node, className? }]
 * rows    : tableau d'objets
 */
export default function DataTable({ columns, rows = [], rowKey = 'id', loading = false, emptyMessage, onRowClick, caption }) {
    const { t } = useTranslation();

    return (
        <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
                {caption && <caption className="sr-only">{caption}</caption>}
                <thead className="bg-surface-alt text-xs uppercase tracking-wide text-ink-muted">
                    <tr>
                        {columns.map((c) => (
                            <th key={c.key} scope="col" className={cn('px-4 py-3 font-semibold', c.className)}>
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-muted">
                                <Loader2 className="mr-2 inline h-4 w-4 animate-spin" aria-hidden="true" />
                                {t('common.loading')}
                            </td>
                        </tr>
                    )}
                    {!loading && rows.length === 0 && (
                        <tr>
                            <td colSpan={columns.length} className="px-4 py-10 text-center text-ink-muted">
                                {emptyMessage ?? t('common.empty')}
                            </td>
                        </tr>
                    )}
                    {!loading &&
                        rows.map((row) => (
                            <tr
                                key={row[rowKey]}
                                onClick={onRowClick ? () => onRowClick(row) : undefined}
                                className={cn(
                                    'border-t border-border even:bg-surface-alt/50',
                                    onRowClick && 'cursor-pointer hover:bg-surface-alt',
                                )}
                            >
                                {columns.map((c) => (
                                    <td key={c.key} className={cn('px-4 py-3 align-middle text-ink', c.className)}>
                                        {c.render ? c.render(row) : row[c.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
}