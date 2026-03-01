import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Your Cart' };

export default function CartPage() {
    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl text-cream mb-12">Your Cart</h1>
                {/* CartItem list + CartSummary rendered here by client components */}
            </div>
        </main>
    );
}
