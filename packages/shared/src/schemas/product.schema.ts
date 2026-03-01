import { z } from 'zod';

export const productFiltersSchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    categoryId: z.string().uuid().optional(),
    scentFamily: z.string().optional(),
    gender: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    search: z.string().optional(),
    sortBy: z.enum(['price_asc', 'price_desc', 'newest', 'name_asc']).default('newest'),
});

export type ProductFilters = z.infer<typeof productFiltersSchema>;
