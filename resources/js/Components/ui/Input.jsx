import { forwardRef, useId } from 'react';
import Field, { controlClasses, describedBy } from './Field';
import { cn } from '../../lib/cn';

const Input = forwardRef(function Input({ label, hint, error, className, id, required, ...props }, ref) {
    const autoId = useId();
    const inputId = id ?? autoId;
    return (
        <Field id={inputId} label={label} hint={hint} error={error} required={required}>
            <input
                ref={ref}
                id={inputId}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(inputId, { hint, error })}
                className={cn(controlClasses(error), 'h-10', className)}
                {...props}
            />
        </Field>
    );
});

export default Input;
