import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Orders' };

export default function OrdersPage() {
    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-3xl text-cream mb-8">Order History</h1>
                {/* Order list client component rendered here */}
            </div>
        </main>
    );
}
