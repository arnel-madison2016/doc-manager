/**
 * Utilitaire pour générer les classes CSS des boutons.
 * Permet d'appliquer les mêmes styles de boutons sur des éléments non-<button> (comme les composants <Link> d'Inertia ou des balises <a>).
 *
 * @param {Object} options
 * @param {'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'} [options.variant='primary']
 * @param {'sm' | 'md' | 'lg'} [options.size='md']
 * @param {string} [options.className='']
 * @returns {string}
 */
export function buttonClasses({ variant = 'primary', size = 'md', className = '' } = {}) {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-md';

    const variants = {
        primary: 'bg-primary-600 text-surface hover:bg-primary-700 shadow-sm',
        secondary: 'bg-surface-alt text-ink border border-border hover:bg-surface-alt/80',
        danger: 'bg-danger text-surface hover:bg-danger/90 shadow-sm',
        ghost: 'text-ink hover:bg-surface-alt',
        outline: 'border border-border text-ink hover:bg-surface-alt',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base',
    };

    const selectedVariant = variants[variant] || variants.primary;
    const selectedSize = sizes[size] || sizes.md;

    return `${baseStyles} ${selectedVariant} ${selectedSize} ${className}`.trim();
}

export default buttonClasses;