import { Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { cn } from '../../lib/cn';

export default function Logo({ className, href = '/' }) {
    return (
        <Link href={href} className={cn('inline-flex items-center gap-2 font-bold text-ink', className)}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg tracking-tight">GEDoc</span>
        </Link>
    );
}
