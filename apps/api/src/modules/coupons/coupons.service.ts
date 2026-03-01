import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CouponsService {
    constructor(private readonly prisma: PrismaService) { }

    async validate(code: string, subtotal: number) {
        const coupon = await this.prisma.coupon.findUnique({
            where: { code: code.toUpperCase(), isActive: true },
        });
        if (!coupon) throw new NotFoundException('Coupon not found or inactive');
        if (coupon.expiresAt && coupon.expiresAt < new Date()) {
            throw new BadRequestException('Coupon has expired');
        }
        if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            throw new BadRequestException('Coupon usage limit reached');
        }
        if (coupon.minOrderValue && subtotal < coupon.minOrderValue.toNumber()) {
            throw new BadRequestException(`Minimum order value is $${coupon.minOrderValue}`);
        }

        const discount =
            coupon.type === 'PERCENTAGE'
                ? subtotal * (coupon.value.toNumber() / 100)
                : coupon.value.toNumber();

        return {
            id: coupon.id,
            code: coupon.code,
            type: coupon.type,
            value: this.prisma.toNumber(coupon.value),
            discount: Math.min(discount, subtotal),
        };
    }
}
