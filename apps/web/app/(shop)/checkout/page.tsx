import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Checkout' };

export default function CheckoutPage() {
    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
                <div>
                    <h1 className="font-serif text-3xl text-cream mb-8">Complete Your Order</h1>
                    {/* ShippingForm, PaymentForm rendered here */}
                </div>
                <div>
                    {/* OrderSummary rendered here */}
                </div>
            </div>
        </main>
    );
}
