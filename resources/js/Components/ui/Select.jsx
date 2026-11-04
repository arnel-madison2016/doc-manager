import { forwardRef, useId } from 'react';
import Field, { controlClasses, describedBy } from './Field';
import { cn } from '../../lib/cn';

// options : [{ value, label }]
const Select = forwardRef(function Select(
    { label, hint, error, className, id, required, options = [], placeholder, ...props },
    ref,
) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
        <Field id={fieldId} label={label} hint={hint} error={error} required={required}>
            <select
                ref={ref}
                id={fieldId}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(fieldId, { hint, error })}
                className={cn(controlClasses(error), 'h-10', className)}
                {...props}
            >
                {placeholder !== undefined && <option value="">{placeholder}</option>}
                {options.map((o) => (
                    <option key={o.value} value={o.value}>
                        {o.label}
                    </option>
                ))}
            </select>
        </Field>
    );
});

export default Select;
