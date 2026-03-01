'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { ProductSummary } from '@perfume/shared';
import { formatPrice } from '../../lib/utils';
import { useCartStore } from '../../store/cart.store';
import { Button } from '../ui/Button';

interface ProductCardProps {
    product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((s) => s.addItem);
    const defaultVariant = product.variants.find((v) => v.isDefault) ?? product.variants[0];
    const fallbackImage = '/placeholder-product.jpg';

    function handleAddToCart(e: React.MouseEvent) {
        e.preventDefault(); // Don't navigate to product page
        if (!defaultVariant) return;
        addItem({
            variantId: defaultVariant.id,
            productId: product.id,
            name: product.name,
            price: Number(defaultVariant.price),
            quantity: 1,
            image: product.images?.[0]?.url ?? null,
            variantLabel: `${defaultVariant.sizeMl}ml`,
        });
    }

    return (
        <Link
            href={`/products/${product.slug}`}
            className="group relative flex flex-col bg-obsidian-soft border border-white/5 hover:border-gold/30 transition-all duration-300"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-obsidian-muted">
                <Image
                    src={product.images?.[0]?.url ?? fallbackImage}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Quick add on hover */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 p-3">
                    <Button
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={handleAddToCart}
                        aria-label={`Add ${product.name} to cart`}
                    >
                        Add to Cart
                    </Button>
                </div>
            </div>

            {/* Info */}
            <div className="p-4 flex flex-col flex-1">
                {product.scentFamily && (
                    <p className="text-[10px] tracking-widest uppercase text-gold/80 mb-1">
                        {product.scentFamily}
                    </p>
                )}
                <h2 className="font-serif text-cream text-lg leading-snug mb-2">{product.name}</h2>
                {defaultVariant && (
                    <p className="text-cream/60 text-sm mt-auto">
                        {formatPrice(Number(defaultVariant.price))}
                        {defaultVariant.compareAtPrice && Number(defaultVariant.compareAtPrice) > Number(defaultVariant.price) && (
                            <span className="line-through text-cream/30 ml-2">
                                {formatPrice(Number(defaultVariant.compareAtPrice))}
                            </span>
                        )}
                    </p>
                )}
            </div>
        </Link>
    );
}
