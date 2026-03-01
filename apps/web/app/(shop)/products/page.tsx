import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'All Fragrances',
    description: 'Browse our complete collection of luxury perfumes. Filter by scent family, gender, and price.',
};

export default function ProductsPage() {
    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-serif text-4xl text-cream mb-2">Our Collection</h1>
                <p className="text-cream/50 mb-12">Discover scents crafted for distinction</p>
                {/* ProductGrid and ProductFilters are client components rendered here */}
                <div id="product-catalog" />
            </div>
        </main>
    );
}
