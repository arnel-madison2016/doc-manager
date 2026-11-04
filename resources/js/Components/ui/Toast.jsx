import { useCallback, useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, Info, XCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../../lib/cn';

const EVENT = 'gedoc:toast';

// Déclenchement impératif depuis n'importe quel composant : toast('Enregistré', 'success')
export function toast(message, type = 'success') {
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { message, type } }));
}

const styles = {
    success: { icon: CheckCircle2, cls: 'border-success text-success-text' },
    error: { icon: XCircle, cls: 'border-danger text-danger-text' },
    info: { icon: Info, cls: 'border-primary-500 text-primary-text' },
};

// Affiche les messages flash Laravel (props partagées `flash`) et les toasts impératifs.
export default function Toaster() {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    const [items, setItems] = useState([]);

    const remove = useCallback((id) => setItems((l) => l.filter((i) => i.id !== id)), []);
    const push = useCallback(
        ({ message, type = 'success' }) => {
            const id = `${Date.now()}-${Math.random()}`;
            setItems((l) => [...l, { id, message, type }]);
            setTimeout(() => remove(id), 5000);
        },
        [remove],
    );

    useEffect(() => {
        if (flash?.message) push({ message: flash.message, type: flash.type });
    }, [flash]);

    useEffect(() => {
        const handler = (e) => push(e.detail);
        window.addEventListener(EVENT, handler);
        return () => window.removeEventListener(EVENT, handler);
    }, [push]);

    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-2">
            {items.map(({ id, message, type }) => {
                const { icon: Icon, cls } = styles[type] ?? styles.info;
                return (
                    <div
                        key={id}
                        role="status"
                        className={cn(
                            'pointer-events-auto flex items-start gap-3 rounded-lg border-l-4 bg-surface p-3 text-sm shadow-lg ring-1 ring-border',
                            cls,
                        )}
                    >
                        <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
                        <p className="flex-1 text-ink">{message}</p>
                        <button type="button" onClick={() => remove(id)} aria-label={t('common.close')} className="text-ink-muted hover:text-ink">
                            <X className="h-4 w-4" aria-hidden="true" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}
