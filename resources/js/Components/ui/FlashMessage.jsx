import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash?.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    if (!visible || !message) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed bottom-5 right-5 z-50 max-w-md animate-fade-in">
            <div className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg ${
                isSuccess ? 'bg-success-soft border-success text-success' : 'bg-danger-soft border-danger text-danger'
            }`}>
                {isSuccess ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
                <p className="text-sm font-medium flex-1">{message}</p>
                <button onClick={() => setVisible(false)} className="p-1 hover:opacity-70 transition-opacity">
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}