import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: {
        default: 'Luxira Scents — Premium Artisanal Fragrances',
        template: '%s | Luxira Scents',
    },
    description:
        'Discover premium artisanal fragrances crafted for those who seek distinction. Free shipping on orders over $100.',
    keywords: ['perfume', 'fragrance', 'oud', 'luxury scents', 'artisanal perfume'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        siteName: 'Luxira Scents',
    },
    robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body>{children}</body>
        </html>
    );
}
