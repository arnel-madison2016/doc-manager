import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title, description, action }) {
    return (
        <div className="text-center py-12 px-4 bg-surface rounded-lg border border-border">
            <FolderOpen className="w-12 h-12 mx-auto text-ink-muted mb-3" />
            <h3 className="text-base font-semibold text-ink">{title}</h3>
            {description && <p className="text-sm text-ink-muted mt-1 max-w-sm mx-auto">{description}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}