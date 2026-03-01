import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    fullWidth?: boolean;
}

export function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    const base = 'inline-flex items-center justify-center font-medium tracking-wider uppercase text-xs transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian';

    const variants = {
        primary: 'bg-gold text-obsidian hover:bg-gold-light active:scale-[0.98]',
        outline: 'border border-gold text-gold hover:bg-gold hover:text-obsidian',
        ghost: 'text-cream/70 hover:text-cream hover:bg-white/5',
    };

    const sizes = {
        sm: 'h-8 px-4 text-[10px]',
        md: 'h-11 px-8',
        lg: 'h-14 px-12',
    };

    return (
        <button
            className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                    Loading…
                </span>
            ) : children}
        </button>
    );
}
