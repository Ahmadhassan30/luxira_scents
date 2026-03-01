import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { InventoryService } from '../inventory/inventory.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly inventory: InventoryService,
    ) { }

    async create(dto: CreateOrderDto, userId?: string) {
        // 1. Validate all variants exist and have enough stock
        const variantIds = dto.items.map((i) => i.variantId);
        const variants = await this.prisma.productVariant.findMany({
            where: { id: { in: variantIds } },
            include: { product: { select: { name: true } } },
        });

        for (const item of dto.items) {
            const variant = variants.find((v) => v.id === item.variantId);
            if (!variant) throw new NotFoundException(`Variant ${item.variantId} not found`);
            if (variant.stockQuantity < item.quantity) {
                throw new BadRequestException(
                    `Insufficient stock for ${variant.product.name} ${variant.sizeMl}ml`,
                );
            }
        }

        // 2. Apply coupon if provided
        let discountAmount = 0;
        let couponId: string | undefined;
        if (dto.couponCode) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: dto.couponCode, isActive: true },
            });
            if (!coupon) throw new BadRequestException('Invalid or expired coupon');
            if (coupon.expiresAt && coupon.expiresAt < new Date()) {
                throw new BadRequestException('Coupon has expired');
            }
            if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
                throw new BadRequestException('Coupon usage limit reached');
            }

            const subtotal = variants.reduce((sum, v) => {
                const item = dto.items.find((i) => i.variantId === v.id)!;
                return sum + v.price.toNumber() * item.quantity;
            }, 0);

            if (coupon.minOrderValue && subtotal < coupon.minOrderValue.toNumber()) {
                throw new BadRequestException(
                    `Minimum order value for this coupon is $${coupon.minOrderValue}`,
                );
            }

            discountAmount =
                coupon.type === 'PERCENTAGE'
                    ? subtotal * (coupon.value.toNumber() / 100)
                    : coupon.value.toNumber();
            couponId = coupon.id;
        }

        // 3. Calculate totals
        const subtotal = variants.reduce((sum, v) => {
            const item = dto.items.find((i) => i.variantId === v.id)!;
            return sum + v.price.toNumber() * item.quantity;
        }, 0);
        const shippingAmount = subtotal >= 100 ? 0 : 9.99; // Free shipping over $100
        const total = subtotal - discountAmount + shippingAmount;

        // 4. Generate order number using PostgreSQL sequence — atomic, no duplicates
        const orderNumber = await this.prisma.generateOrderNumber();

        // 5. Create order and decrement stock in a transaction
        const order = await this.prisma.$transaction(async (tx) => {
            const created = await tx.order.create({
                data: {
                    orderNumber,
                    userId,
                    guestEmail: dto.guestEmail,
                    subtotal,
                    discountAmount,
                    shippingAmount,
                    total,
                    couponId,
                    shippingAddressId: dto.shippingAddressId,
                    status: 'PENDING',
                    items: {
                        create: dto.items.map((item) => {
                            const variant = variants.find((v) => v.id === item.variantId)!;
                            return {
                                productId: variant.productId,
                                productVariantId: variant.id,
                                quantity: item.quantity,
                                unitPrice: variant.price,
                                productName: variant.product.name,
                                variantLabel: `${variant.sizeMl}ml`,
                            };
                        }),
                    },
                },
                include: { items: true },
            });

            // Decrement stock atomically
            for (const item of dto.items) {
                await tx.productVariant.update({
                    where: { id: item.variantId },
                    data: { stockQuantity: { decrement: item.quantity } },
                });
            }

            // Increment coupon usage
            if (couponId) {
                await tx.coupon.update({
                    where: { id: couponId },
                    data: { usageCount: { increment: 1 } },
                });
            }

            return created;
        });

        return {
            ...order,
            subtotal: this.prisma.toNumber(order.subtotal),
            discountAmount: this.prisma.toNumber(order.discountAmount),
            shippingAmount: this.prisma.toNumber(order.shippingAmount),
            total: this.prisma.toNumber(order.total),
        };
    }

    async findByUser(userId: string) {
        const orders = await this.prisma.order.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: { items: true },
        });
        return orders.map((o) => ({
            ...o,
            subtotal: this.prisma.toNumber(o.subtotal),
            total: this.prisma.toNumber(o.total),
        }));
    }

    async findById(id: string, userId: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: { items: true, shippingAddress: true },
        });
        if (!order) throw new NotFoundException('Order not found');
        if (order.userId && order.userId !== userId) throw new ForbiddenException();
        return {
            ...order,
            subtotal: this.prisma.toNumber(order.subtotal),
            discountAmount: this.prisma.toNumber(order.discountAmount),
            shippingAmount: this.prisma.toNumber(order.shippingAmount),
            total: this.prisma.toNumber(order.total),
        };
    }
}
