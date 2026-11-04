import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
    theme: 'clair',
    themes: ['clair', 'sombre', 'auto'],
    setTheme: () => {},
    syncFromServer: () => {},
});

export default function ThemeProvider({ children, initial = 'clair' }) {
    const [theme, setThemeState] = useState(() => {
        return localStorage.getItem('theme') || initial || 'clair';
    });

    const themes = ['clair', 'sombre', 'auto'];

    const setTheme = (newTheme) => {
        setThemeState(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Définition de la fonction de synchronisation depuis le serveur
    const syncFromServer = (serverTheme) => {
        if (serverTheme && themes.includes(serverTheme)) {
            setTheme(serverTheme);
        }
    };

    useEffect(() => {
        const root = document.documentElement;
        let effective = theme;

        if (theme === 'auto') {
            effective = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'sombre' : 'clair';
        }

        if (effective === 'sombre') {
            root.setAttribute('data-theme', 'sombre');
            root.classList.add('dark');
        } else {
            root.setAttribute('data-theme', 'clair');
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, themes, setTheme, syncFromServer }}>
            {children || null}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);