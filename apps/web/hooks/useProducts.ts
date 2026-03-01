'use client';

import { useQuery } from '@tanstack/react-query';
import type { ProductSummary, PaginatedResult } from '@perfume/shared';
import { api } from '../lib/api';

interface ProductFilters {
    page?: number;
    limit?: number;
    categoryId?: string;
    scentFamily?: string;
    gender?: string;
    search?: string;
    sortBy?: string;
}

export function useProducts(filters: ProductFilters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== '') params.set(k, String(v));
    });

    return useQuery<PaginatedResult<ProductSummary>>({
        queryKey: ['products', filters],
        queryFn: async () => {
            const { data } = await api.get<PaginatedResult<ProductSummary>>(
                `/products?${params.toString()}`,
            );
            return data!;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        placeholderData: (prev) => prev, // keep previous page data while loading next
    });
}
