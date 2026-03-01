'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-obsidian text-cream gap-6 p-8">
            <h1 className="text-3xl font-serif">Something went wrong</h1>
            <p className="text-cream/60 text-center max-w-md">
                {error.message || 'An unexpected error occurred. Please try again.'}
            </p>
            <button
                onClick={reset}
                className="px-8 py-3 bg-gold text-obsidian font-semibold hover:bg-gold-light transition-colors rounded"
            >
                Try again
            </button>
        </div>
    );
}
