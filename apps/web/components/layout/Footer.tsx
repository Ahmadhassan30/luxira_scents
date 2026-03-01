import Link from 'next/link';

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-obsidian py-16 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
                <div className="col-span-2 md:col-span-1">
                    <p className="font-serif text-2xl text-cream mb-3">
                        Luxira<em className="text-gold not-italic"> Scents</em>
                    </p>
                    <p className="text-cream/40 text-sm leading-relaxed">
                        Artisanal fragrances crafted for those who seek distinction.
                    </p>
                </div>

                <div>
                    <h3 className="text-xs tracking-widest uppercase text-cream/40 mb-4">Shop</h3>
                    <ul className="space-y-3 text-sm text-cream/60">
                        <li><Link href="/products" className="hover:text-cream transition-colors">All Fragrances</Link></li>
                        <li><Link href="/products?category=oud" className="hover:text-cream transition-colors">Oud</Link></li>
                        <li><Link href="/products?category=floral" className="hover:text-cream transition-colors">Floral</Link></li>
                        <li><Link href="/products?category=citrus" className="hover:text-cream transition-colors">Citrus</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs tracking-widest uppercase text-cream/40 mb-4">Support</h3>
                    <ul className="space-y-3 text-sm text-cream/60">
                        <li><Link href="/shipping" className="hover:text-cream transition-colors">Shipping & Returns</Link></li>
                        <li><Link href="/faq" className="hover:text-cream transition-colors">FAQ</Link></li>
                        <li><Link href="/contact" className="hover:text-cream transition-colors">Contact</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-xs tracking-widest uppercase text-cream/40 mb-4">Legal</h3>
                    <ul className="space-y-3 text-sm text-cream/60">
                        <li><Link href="/privacy" className="hover:text-cream transition-colors">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-cream transition-colors">Terms</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-xs text-cream/30">
                © {new Date().getFullYear()} Luxira Scents. All rights reserved.
            </div>
        </footer>
    );
}
