import React from 'react';

export function Switch({ checked, onChange, label, description }) {
    return (
        <label className="flex items-center justify-between cursor-pointer">
            <div>
                <span className="text-sm font-medium text-ink block">{label}</span>
                {description && <span className="text-xs text-ink-muted block">{description}</span>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                    checked ? 'bg-primary-600' : 'bg-border'
                }`}
            >
                <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-surface shadow-lg ring-0 transition duration-200 ease-in-out ${
                        checked ? 'translate-x-5' : 'translate-x-0'
                    }`}
                />
            </button>
        </label>
    );
}