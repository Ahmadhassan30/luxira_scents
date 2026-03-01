import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Order Details' };

export default function OrderDetailPage({ params }: { params: { id: string } }) {
    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-3xl mx-auto">
                <h1 className="font-serif text-3xl text-cream mb-8">Order #{params.id}</h1>
                {/* Order detail client component rendered here */}
            </div>
        </main>
    );
}
