import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Luxira Scents — Premium Artisanal Fragrances',
    description:
        'Discover premium artisanal fragrances. Free shipping on orders over $100. Shop oud, floral, and citrus collections.',
};

export default function HomePage() {
    return (
        <main>
            {/* Hero */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden bg-obsidian">
                <div className="absolute inset-0 bg-gradient-to-b from-obsidian/30 via-transparent to-obsidian/80" />
                <div className="relative z-10 text-center max-w-3xl mx-auto px-6 animate-fadeIn">
                    <p className="text-gold font-sans text-xs tracking-[0.4em] uppercase mb-6">
                        Artisanal Fragrances
                    </p>
                    <h1 className="font-serif text-6xl md:text-8xl text-cream leading-none mb-8">
                        Wear Your
                        <br />
                        <em>Signature</em>
                    </h1>
                    <p className="text-cream/60 text-lg mb-12 max-w-lg mx-auto">
                        Every scent tells a story. Discover yours in our curated collection of luxury fragrances.
                    </p>
                    <a
                        href="/products"
                        className="inline-block px-10 py-4 bg-gold text-obsidian font-semibold tracking-wider uppercase text-sm hover:bg-gold-light transition-all duration-300"
                    >
                        Explore Collection
                    </a>
                </div>
            </section>
        </main>
    );
}
