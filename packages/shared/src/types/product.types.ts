import { ProductStatus } from '../constants/product-status';

export interface ProductVariant {
    id: string;
    productId: string;
    sizeMl: number;
    price: number;
    compareAtPrice?: number;
    sku: string;
    stockQuantity: number;
    isDefault: boolean;
}

export interface ProductImage {
    id: string;
    productId: string;
    url: string;
    altText?: string;
    position: number;
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    description?: string;
    status: ProductStatus;
    categoryId?: string;
    scentFamily?: string;
    gender?: string;
    topNotes: string[];
    middleNotes: string[];
    baseNotes: string[];
    variants: ProductVariant[];
    images: ProductImage[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductSummary {
    id: string;
    name: string;
    slug: string;
    scentFamily?: string;
    gender?: string;
    images: ProductImage[];
    variants: Pick<ProductVariant, 'id' | 'sizeMl' | 'price' | 'compareAtPrice' | 'isDefault'>[];
}
