import React from 'react';

export function Tabs({ tabs, activeTab, onChange }) {
    return (
        <div className="flex space-x-2 border-b border-border">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    onClick={() => onChange(tab.id)}
                    className={`pb-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                            ? 'border-primary-600 text-primary-600'
                            : 'border-transparent text-ink-muted hover:text-ink'
                    }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}