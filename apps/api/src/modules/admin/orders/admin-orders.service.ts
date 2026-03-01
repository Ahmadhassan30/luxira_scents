import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminOrdersService {
    constructor(private readonly prisma: PrismaService) { }

    findAll(page = 1, limit = 50) {
        const skip = (page - 1) * limit;
        return this.prisma.order.findMany({
            skip, take: limit,
            orderBy: { createdAt: 'desc' },
            include: { items: true, user: { select: { email: true, firstName: true } } },
        });
    }

    updateStatus(id: string, status: string) {
        return this.prisma.order.update({
            where: { id },
            data: { status: status as never },
        });
    }

    updateTracking(id: string, trackingNumber: string, trackingCarrier: string) {
        return this.prisma.order.update({
            where: { id },
            data: { trackingNumber, trackingCarrier, status: 'SHIPPED' },
        });
    }
}
