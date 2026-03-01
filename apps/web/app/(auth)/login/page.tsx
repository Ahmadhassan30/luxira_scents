import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Sign In' };

export default function LoginPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-obsidian px-6">
            <div className="w-full max-w-md">
                <h1 className="font-serif text-4xl text-cream text-center mb-2">Welcome Back</h1>
                <p className="text-cream/50 text-center mb-10">Sign in to your account</p>
                {/* LoginForm client component rendered here */}
            </div>
        </main>
    );
}
