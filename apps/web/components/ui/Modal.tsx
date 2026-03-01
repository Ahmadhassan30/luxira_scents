'use client';

import { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', handler);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handler);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === overlayRef.current && onClose()}
        >
            <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" aria-hidden="true" />
            <div
                className={cn('relative bg-obsidian-soft border border-white/10 w-full max-w-lg animate-fadeIn', className)}
            >
                {title && (
                    <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
                        <h2 id="modal-title" className="font-serif text-xl text-cream">{title}</h2>
                        <button onClick={onClose} aria-label="Close modal" className="text-cream/40 hover:text-cream transition-colors text-xl leading-none">×</button>
                    </div>
                )}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
