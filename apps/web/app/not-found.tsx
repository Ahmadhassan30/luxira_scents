import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen flex flex-col items-center justify-center bg-obsidian text-cream gap-8 p-8">
            <p className="text-gold font-serif text-sm tracking-[0.3em] uppercase">404</p>
            <h1 className="text-5xl font-serif">Page Not Found</h1>
            <p className="text-cream/60 text-center max-w-md">
                The page you&apos;re looking for has drifted away like a fleeting scent.
            </p>
            <Link
                href="/"
                className="px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-obsidian transition-all rounded font-medium"
            >
                Return Home
            </Link>
        </main>
    );
}
