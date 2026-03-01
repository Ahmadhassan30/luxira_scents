import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findById(id: string) {
        const user = await this.prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: {
                id: true, email: true, role: true,
                firstName: true, lastName: true, phone: true,
                isActive: true, createdAt: true,
            },
        });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async update(id: string, dto: UpdateUserDto) {
        return this.prisma.user.update({
            where: { id },
            data: dto,
            select: {
                id: true, email: true, role: true,
                firstName: true, lastName: true, phone: true,
            },
        });
    }

    async softDelete(id: string) {
        await this.prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), isActive: false },
        });
    }

    async findAddresses(userId: string) {
        return this.prisma.address.findMany({ where: { userId } });
    }

    async createAddress(userId: string, data: {
        fullName: string; phone?: string; line1: string; line2?: string;
        city: string; state?: string; postalCode: string; country: string; isDefault?: boolean;
    }) {
        if (data.isDefault) {
            await this.prisma.address.updateMany({
                where: { userId },
                data: { isDefault: false },
            });
        }
        return this.prisma.address.create({ data: { ...data, userId } });
    }
}
