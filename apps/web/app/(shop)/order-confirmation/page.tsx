import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Order Confirmed' };

export default function OrderConfirmationPage({
    searchParams,
}: {
    searchParams: { order?: string };
}) {
    return (
        <main className="min-h-screen flex items-center justify-center bg-obsidian px-6">
            <div className="text-center max-w-lg animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-8">
                    <span className="text-gold text-2xl">✓</span>
                </div>
                <h1 className="font-serif text-4xl text-cream mb-4">Order Confirmed</h1>
                {searchParams.order && (
                    <p className="text-cream/60 mb-2">Order #{searchParams.order}</p>
                )}
                <p className="text-cream/50 mb-8">
                    Thank you for your purchase. A confirmation email is on its way.
                </p>
                <a
                    href="/account/orders"
                    className="inline-block px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-obsidian transition-all"
                >
                    View Orders
                </a>
            </div>
        </main>
    );
}
