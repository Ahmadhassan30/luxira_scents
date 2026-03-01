import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
    constructor(private readonly prisma: PrismaService) { }

    async getDashboard() {
        const [totalOrders, totalRevenue, totalUsers, recentOrders] = await Promise.all([
            this.prisma.order.count({ where: { status: { not: 'CANCELLED' } } }),
            this.prisma.order.aggregate({
                where: { status: { not: 'CANCELLED' } },
                _sum: { total: true },
            }),
            this.prisma.user.count(),
            this.prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: { orderNumber: true, total: true, status: true, createdAt: true },
            }),
        ]);

        return {
            totalOrders,
            totalRevenue: this.prisma.toNumber(totalRevenue._sum.total),
            totalUsers,
            recentOrders: recentOrders.map((o) => ({
                ...o,
                total: this.prisma.toNumber(o.total),
            })),
        };
    }
}
