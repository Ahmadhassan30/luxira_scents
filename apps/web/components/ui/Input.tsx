import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Input({ label, error, hint, className, id, ...props }: InputProps) {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={inputId} className="text-xs text-cream/60 tracking-wider uppercase">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={cn(
                    'w-full h-12 bg-obsidian-muted border px-4 text-cream placeholder:text-cream/30 text-sm outline-none transition-all',
                    'focus:border-gold',
                    error ? 'border-red-500/70' : 'border-white/10',
                    className,
                )}
                {...props}
            />
            {error && <p className="text-xs text-red-400">{error}</p>}
            {hint && !error && <p className="text-xs text-cream/40">{hint}</p>}
        </div>
    );
}
