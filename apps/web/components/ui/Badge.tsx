import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps {
    children: React.ReactNode;
    variant?: 'gold' | 'success' | 'warning' | 'error' | 'neutral';
    className?: string;
}

export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
    const variants = {
        gold: 'bg-gold/10 text-gold border-gold/30',
        success: 'bg-green-500/10 text-green-400 border-green-500/30',
        warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        error: 'bg-red-500/10 text-red-400 border-red-500/30',
        neutral: 'bg-white/5 text-cream/60 border-white/10',
    };

    return (
        <span
            className={cn(
                'inline-flex items-center px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase border',
                variants[variant],
                className,
            )}
        >
            {children}
        </span>
    );
}
