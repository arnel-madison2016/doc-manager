import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

const tones = {
    info: { icon: Info, cls: 'bg-primary-50 text-primary-text border-primary-500' },
    success: { icon: CheckCircle2, cls: 'bg-success-soft text-success-text border-success' },
    warning: { icon: AlertTriangle, cls: 'bg-warning-soft text-warning-text border-warning' },
    danger: { icon: XCircle, cls: 'bg-danger-soft text-danger-text border-danger' },
};

// Bandeau d'information : title (facultatif), children (message), actions (liens/boutons).
export default function Alert({ tone = 'info', title, children, actions, className }) {
    const { icon: Icon, cls } = tones[tone] ?? tones.info;
    return (
        <div role={tone === 'danger' || tone === 'warning' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-lg border-l-4 p-4 text-sm', cls, className)}>
            <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div className="min-w-0 flex-1">
                {title && <p className="font-semibold">{title}</p>}
                {children && <div className={cn(title && 'mt-0.5')}>{children}</div>}
                {actions && <div className="mt-3 flex flex-wrap gap-2">{actions}</div>}
            </div>
        </div>
    );
}
