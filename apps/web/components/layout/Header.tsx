'use client';

import Link from 'next/link';
import { useCartStore } from '../../store/cart.store';
import { useAuthStore } from '../../store/auth.store';

export function Header() {
    const totalItems = useCartStore((s) => s.totalItems());
    const openCart = useCartStore((s) => s.openCart);
    const user = useAuthStore((s) => s.user);

    return (
        <header className="fixed top-0 left-0 right-0 z-40 h-16 flex items-center px-6 border-b border-white/5 bg-obsidian/90 backdrop-blur-sm">
            {/* Logo */}
            <Link href="/" className="font-serif text-xl text-cream mr-auto">
                Luxira<em className="text-gold not-italic"> Scents</em>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest uppercase text-cream/60">
                <Link href="/products" className="hover:text-cream transition-colors">Shop</Link>
                <Link href="/products?category=oud" className="hover:text-cream transition-colors">Oud</Link>
                <Link href="/products?category=floral" className="hover:text-cream transition-colors">Floral</Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4 ml-8">
                {user ? (
                    <Link href="/account" className="text-xs uppercase tracking-widest text-cream/60 hover:text-cream transition-colors">
                        Account
                    </Link>
                ) : (
                    <Link href="/login" className="text-xs uppercase tracking-widest text-cream/60 hover:text-cream transition-colors">
                        Sign In
                    </Link>
                )}

                <button
                    onClick={openCart}
                    aria-label={`Open cart, ${totalItems} items`}
                    className="relative w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream">
                        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <path d="M16 10a4 4 0 01-8 0" />
                    </svg>
                    {totalItems > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold text-obsidian text-[9px] font-bold rounded-full flex items-center justify-center">
                            {totalItems > 9 ? '9+' : totalItems}
                        </span>
                    )}
                </button>
            </div>
        </header>
    );
}
