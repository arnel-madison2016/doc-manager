import React from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/theme/ThemeProvider'; // Import nommé indispensable { useTheme }
import { cn } from '@/lib/cn';

const icons = { clair: Sun, sombre: Moon, auto: Monitor };

export default function ThemeSwitch({ variant = 'icon', className }) {
    const { t } = useTranslation();
    const { theme = 'auto', themes = ['clair', 'sombre', 'auto'], setTheme } = useTheme();

    if (variant === 'segmented') {
        return (
            <div role="radiogroup" aria-label={t('theme.label', 'Thème')} className={cn('inline-flex rounded-lg border border-border bg-surface p-1', className)}>
                {themes.map((value) => {
                    const Icon = icons[value] || Sun;
                    const active = theme === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            role="radio"
                            aria-checked={active}
                            onClick={() => setTheme(value)}
                            className={cn(
                                'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                                active ? 'bg-primary-600 text-white' : 'text-ink-muted hover:text-ink',
                            )}
                        >
                            <Icon className="h-4 w-4" aria-hidden="true" />
                            {t(`theme.${value}`, value)}
                        </button>
                    );
                })}
            </div>
        );
    }

    const Icon = icons[theme] || Sun;
    const next = themes[(themes.indexOf(theme) + 1) % themes.length];
    return (
        <button
            type="button"
            onClick={() => setTheme(next)}
            title={`${t('theme.switch', 'Changer de thème')} (${t(`theme.${theme}`, theme)})`}
            aria-label={`${t('theme.switch', 'Changer de thème')} — ${t(`theme.${theme}`, theme)}`}
            className={cn('rounded-lg p-2 text-ink-muted transition-colors hover:bg-surface-alt hover:text-ink', className)}
        >
            <Icon className="h-5 w-5" aria-hidden="true" />
        </button>
    );
}