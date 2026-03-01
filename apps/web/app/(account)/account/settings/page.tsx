import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Account Settings' };

export default function SettingsPage() {
    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-xl mx-auto">
                <h1 className="font-serif text-3xl text-cream mb-8">Account Settings</h1>
            </div>
        </main>
    );
}
