import { useEffect, useState } from 'react';

// État React mémorisé dans localStorage (ex. vue « tableau » ou « cartes »).
export function useLocalStorage(key, initial) {
    
    const [value, setValue] = useState(() => {
        try {
            const stored = localStorage.getItem(key);
            return stored === null ? initial : JSON.parse(stored);
        } catch {
            return initial;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch {
            /* stockage indisponible : on ignore */
        }
    }, [key, value]);

    return [value, setValue];
}
