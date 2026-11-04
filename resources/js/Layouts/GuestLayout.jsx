import React from 'react';
import FlashMessage from '@/components/ui/FlashMessage';

export default function GuestLayout({ children }) {
    return (
        <div className="min-h-screen bg-surface-alt flex flex-col items-center justify-center p-6">
            <FlashMessage />
            <div className="w-full max-w-md space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-primary-600 tracking-tight">GEDoc v2.0</h1>
                    <p className="text-sm text-ink-muted mt-2">Gestion Électronique Sécurisée des Documents</p>
                </div>
                <div className="bg-surface border border-border rounded-xl shadow-lg p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}