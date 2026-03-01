import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class InventoryService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
    ) { }

    async checkStock(variantId: string, quantity: number): Promise<boolean> {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
            select: { stockQuantity: true },
        });
        return (variant?.stockQuantity ?? 0) >= quantity;
    }

    async adjustStock(variantId: string, delta: number) {
        const variant = await this.prisma.productVariant.update({
            where: { id: variantId },
            data: { stockQuantity: { increment: delta } },
        });
        if (variant.stockQuantity < 0) {
            throw new BadRequestException('Insufficient stock');
        }
        // Invalidate product cache entries
        await this.cache.delByPattern('product:*');
        return variant;
    }

    async getStockLevel(variantId: string): Promise<number> {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: variantId },
            select: { stockQuantity: true },
        });
        return variant?.stockQuantity ?? 0;
    }
}
