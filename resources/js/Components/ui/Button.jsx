import { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';

const base =
    'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors ' +
    'disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'border border-border bg-surface text-ink hover:bg-surface-alt',
    ghost: 'text-ink hover:bg-surface-alt',
    danger: 'bg-danger text-white hover:opacity-90',
};

const sizes = {
    sm: 'h-8 px-3 text-[13px]',
    md: 'h-10 px-4 text-sm',
    lg: 'h-12 px-6 text-base',
};

// Classes réutilisables pour habiller un <Link> Inertia ou un <a> comme un bouton.
export const buttonClasses = ({ variant = 'primary', size = 'md', className } = {}) =>
    cn(base, variants[variant], sizes[size], className);

const Button = forwardRef(function Button(
    { variant = 'primary', size = 'md', loading = false, className, children, disabled, type = 'button', ...props },
    ref,
) {
    return (
        <button
            ref={ref}
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={buttonClasses({ variant, size, className })}
            {...props}
        >
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {children}
        </button>
    );
});

export default Button;