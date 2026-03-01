import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CacheService } from '../../cache/cache.service';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { UpdateProductDto } from '../../products/dto/update-product.dto';

@Injectable()
export class AdminProductsService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
    ) { }

    findAll() {
        return this.prisma.product.findMany({
            include: { variants: true, images: true, category: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async create(dto: CreateProductDto) {
        const product = await this.prisma.product.create({
            data: dto,
            include: { variants: true, images: true },
        });
        await this.cache.delByPattern('products:*');
        return product;
    }

    async update(id: string, dto: UpdateProductDto) {
        const product = await this.prisma.product.update({
            where: { id },
            data: dto,
            include: { variants: true, images: true },
        });
        await this.cache.del(`product:${product.slug}`);
        await this.cache.delByPattern('products:*');
        return product;
    }

    async remove(id: string) {
        const product = await this.prisma.product.update({
            where: { id },
            data: { status: 'ARCHIVED' },
        });
        await this.cache.del(`product:${product.slug}`);
        await this.cache.delByPattern('products:*');
    }
}
