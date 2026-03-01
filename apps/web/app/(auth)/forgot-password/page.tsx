import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Forgot Password' };

export default function ForgotPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-obsidian px-6">
            <div className="w-full max-w-md">
                <h1 className="font-serif text-3xl text-cream text-center mb-2">Reset Password</h1>
                <p className="text-cream/50 text-center mb-10">
                    Enter your email address and we&apos;ll send a reset link.
                </p>
                {/* ForgotPasswordForm client component rendered here */}
            </div>
        </main>
    );
}
