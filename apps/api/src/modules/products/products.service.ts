import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { ProductFiltersDto } from './dto/product-filters.dto';

const PRODUCT_CACHE_TTL = 300; // 5 minutes

@Injectable()
export class ProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
    ) { }

    async findAll(filters: ProductFiltersDto) {
        const cacheKey = `products:${JSON.stringify(filters)}`;

        // fail-open: null means cache miss or Redis down
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        const { page = 1, limit = 20, categoryId, scentFamily, gender, search, sortBy = 'newest' } = filters;
        const skip = (page - 1) * limit;

        const where = {
            status: 'PUBLISHED' as const,
            ...(categoryId && { categoryId }),
            ...(scentFamily && { scentFamily }),
            ...(gender && { gender }),
            ...(search && { name: { contains: search, mode: 'insensitive' as const } }),
        };

        const orderBy = {
            newest: { createdAt: 'desc' as const },
            name_asc: { name: 'asc' as const },
            price_asc: { price: 'asc' as const },
            price_desc: { price: 'desc' as const },
        }[sortBy] ?? { createdAt: 'desc' as const };

        const [data, total] = await Promise.all([
            this.prisma.product.findMany({
                where, skip, take: limit,
                orderBy,
                include: { images: { orderBy: { position: 'asc' }, take: 1 }, variants: true },
            }),
            this.prisma.product.count({ where }),
        ]);

        // Serialize Decimal fields to numbers before caching/returning
        const serialized = data.map((p) => ({
            ...p,
            variants: p.variants.map((v) => ({
                ...v,
                price: this.prisma.toNumber(v.price),
                compareAtPrice: this.prisma.toNumber(v.compareAtPrice),
            })),
        }));

        const result = {
            data: serialized,
            meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
        };

        await this.cache.set(cacheKey, result, PRODUCT_CACHE_TTL);
        return result;
    }

    async findBySlug(slug: string) {
        const cacheKey = `product:${slug}`;
        const cached = await this.cache.get(cacheKey);
        if (cached) return cached;

        const product = await this.prisma.product.findFirst({
            where: { slug, status: 'PUBLISHED' },
            include: {
                images: { orderBy: { position: 'asc' } },
                variants: { orderBy: [{ isDefault: 'desc' }, { sizeMl: 'asc' }] },
                category: true,
            },
        });
        if (!product) throw new NotFoundException('Product not found');

        const serialized = {
            ...product,
            variants: product.variants.map((v) => ({
                ...v,
                price: this.prisma.toNumber(v.price),
                compareAtPrice: this.prisma.toNumber(v.compareAtPrice),
            })),
        };

        await this.cache.set(cacheKey, serialized, PRODUCT_CACHE_TTL);
        return serialized;
    }
}
