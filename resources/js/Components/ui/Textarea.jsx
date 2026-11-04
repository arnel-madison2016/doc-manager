import { forwardRef, useId } from 'react';
import Field, { controlClasses, describedBy } from './Field';
import { cn } from '../../lib/cn';

const Textarea = forwardRef(function Textarea({ label, hint, error, className, id, required, rows = 4, ...props }, ref) {
    const autoId = useId();
    const fieldId = id ?? autoId;
    return (
        <Field id={fieldId} label={label} hint={hint} error={error} required={required}>
            <textarea
                ref={ref}
                id={fieldId}
                rows={rows}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy(fieldId, { hint, error })}
                className={cn(controlClasses(error), 'py-2', className)}
                {...props}
            />
        </Field>
    );
});

export default Textarea;
