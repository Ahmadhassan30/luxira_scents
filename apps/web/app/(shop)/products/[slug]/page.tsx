import type { Metadata } from 'next';

type Props = { params: { slug: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
    try {
        const res = await fetch(`${apiUrl}/products/${params.slug}`, { next: { revalidate: 3600 } });
        if (!res.ok) return { title: 'Product Not Found' };
        const { data } = await res.json();
        return {
            title: data?.name ?? 'Product',
            description: data?.description ?? '',
            openGraph: { images: data?.images?.[0]?.url ? [data.images[0].url] : [] },
        };
    } catch {
        return { title: 'Product' };
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
    const res = await fetch(`${apiUrl}/products/${params.slug}`, {
        next: { revalidate: 3600, tags: [`product-${params.slug}`] },
    });

    if (!res.ok) {
        return (
            <main className="min-h-screen flex items-center justify-center bg-obsidian text-cream">
                <p>Product not found.</p>
            </main>
        );
    }

    const { data: product } = await res.json();

    return (
        <main className="min-h-screen bg-obsidian px-6 py-24">
            <div className="max-w-6xl mx-auto">
                <h1 className="font-serif text-5xl text-cream">{product.name}</h1>
                <p className="text-cream/60 mt-4 max-w-xl">{product.description}</p>
                {/* ProductImageGallery, ProductVariantSelector, ScentNotes rendered here */}
            </div>
        </main>
    );
}
