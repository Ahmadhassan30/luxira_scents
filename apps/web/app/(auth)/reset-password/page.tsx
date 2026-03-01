import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Reset Password' };

export default function ResetPasswordPage() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-obsidian px-6">
            <div className="w-full max-w-md">
                <h1 className="font-serif text-3xl text-cream text-center mb-2">Set New Password</h1>
                <p className="text-cream/50 text-center mb-10">Choose a secure password for your account.</p>
                {/* ResetPasswordForm client component rendered here */}
            </div>
        </main>
    );
}
