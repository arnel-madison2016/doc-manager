import React from 'react';
import { Link } from '@inertiajs/react';

export function Pagination({ links = [] }) {
    if (links.length <= 3) return null;

    return (
        <div className="flex items-center justify-center space-x-1 py-4">
            {links.map((link, index) => {
                const isHtml = link.label.includes('&');
                const label = isHtml ? link.label.replace('&laquo;', '«').replace('&raquo;', '»') : link.label;

                if (!link.url) {
                    return (
                        <span
                            key={index}
                            className="px-3 py-1.5 text-xs font-medium text-ink-muted bg-surface-alt border border-border rounded-md opacity-50 cursor-not-allowed"
                            dangerouslySetInnerHTML={{ __html: label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`px-3 py-1.5 text-xs font-medium border rounded-md transition-colors ${
                            link.active
                                ? 'bg-primary-600 text-surface border-primary-600'
                                : 'bg-surface text-ink border-border hover:bg-surface-alt'
                        }`}
                        dangerouslySetInnerHTML={{ __html: label }}
                    />
                );
            })}
        </div>
    );
}