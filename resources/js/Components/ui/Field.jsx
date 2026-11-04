import { cn } from '../../lib/cn';

// Classes communes aux contrôles de formulaire (Input, Textarea, Select).
export const controlClasses = (error) =>
    cn(
        'w-full rounded-lg border bg-surface px-3 text-sm text-ink placeholder:text-ink-muted',
        'transition-colors focus-visible:border-primary-500 disabled:cursor-not-allowed disabled:opacity-60',
        error ? 'border-danger' : 'border-border',
    );

// Enveloppe libellé + aide + erreur, avec les liaisons ARIA nécessaires.
export default function Field({ id, label, hint, error, required, children }) {
    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className="block text-[13px] font-medium text-ink">
                    {label}
                    {required && <span className="ml-0.5 text-danger" aria-hidden="true">*</span>}
                </label>
            )}
            {children}
            {hint && !error && (
                <p id={`${id}-hint`} className="text-xs text-ink-muted">
                    {hint}
                </p>
            )}
            {error && (
                <p id={`${id}-error`} role="alert" className="text-xs font-medium text-danger-text">
                    {error}
                </p>
            )}
        </div>
    );
}

export const describedBy = (id, { hint, error }) =>
    error ? `${id}-error` : hint ? `${id}-hint` : undefined;
