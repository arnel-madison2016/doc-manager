import { cn } from '../../lib/cn';

export default function Card({ title, description, actions, footer, className, bodyClassName, children }) {
    return (
        <section className={cn('rounded-xl border border-border bg-surface shadow-sm', className)}>
            {(title || actions) && (
                <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
                    <div>
                        {title && <h2 className="text-lg font-semibold text-ink">{title}</h2>}
                        {description && <p className="mt-0.5 text-sm text-ink-muted">{description}</p>}
                    </div>
                    {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
                </header>
            )}
            <div className={cn('p-5', bodyClassName)}>{children}</div>
            {footer && <footer className="border-t border-border px-5 py-3">{footer}</footer>}
        </section>
    );
}
