import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'My Account' };

export default function AccountPage() {
    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-4xl mx-auto">
                <h1 className="font-serif text-4xl text-cream mb-2">My Account</h1>
                <p className="text-cream/50">Manage your profile, orders, and addresses.</p>
            </div>
        </main>
    );
}
