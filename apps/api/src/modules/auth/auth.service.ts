import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { CacheService } from '../cache/cache.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

const BCRYPT_ROUNDS = 12;

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService,
        private readonly cache: CacheService,
    ) { }

    async register(dto: RegisterDto) {
        const existing = await this.prisma.user.findFirst({ where: { email: dto.email, deletedAt: null } });
        if (existing) throw new ConflictException('Email already in use');

        const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        const user = await this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
            },
            select: { id: true, email: true, role: true, firstName: true, lastName: true },
        });

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        return { ...tokens, user };
    }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findFirst({ where: { email: dto.email, deletedAt: null } });
        if (!user || !user.passwordHash) throw new UnauthorizedException('Invalid credentials');

        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');

        if (!user.isActive) throw new UnauthorizedException('Account is disabled');

        const tokens = await this.generateTokens(user.id, user.email, user.role);
        const safeUser = { id: user.id, email: user.email, role: user.role, firstName: user.firstName, lastName: user.lastName };
        return { ...tokens, user: safeUser };
    }

    async refreshTokens(userId: string, refreshToken: string) {
        // Verify the refresh token is the one we issued (stored hash in cache)
        const storedHash = await this.cache.get<string>(`refresh:${userId}`);
        if (!storedHash) throw new UnauthorizedException('Refresh token expired or revoked');

        const valid = await bcrypt.compare(refreshToken, storedHash);
        if (!valid) throw new UnauthorizedException('Invalid refresh token');

        const user = await this.prisma.user.findFirst({
            where: { id: userId, deletedAt: null },
            select: { id: true, email: true, role: true },
        });
        if (!user) throw new NotFoundException('User not found');

        return this.generateTokens(user.id, user.email, user.role);
    }

    async logout(userId: string) {
        // Invalidate the refresh token by removing it from cache
        await this.cache.del(`refresh:${userId}`);
    }

    async initiatePasswordReset(email: string) {
        const user = await this.prisma.user.findFirst({ where: { email, deletedAt: null } });
        // Always return success to prevent user enumeration
        if (!user) return;

        const token = crypto.randomUUID();
        const tokenHash = await bcrypt.hash(token, 10);
        // Store hashed token in Redis with 1-hour TTL
        await this.cache.set(`pwd_reset:${user.id}`, tokenHash, 3600);
        // Return token for email service to send (not stored plain anywhere)
        return { userId: user.id, token, email: user.email, name: user.firstName };
    }

    async resetPassword(dto: ResetPasswordDto) {
        const storedHash = await this.cache.get<string>(`pwd_reset:${dto.userId}`);
        if (!storedHash) throw new UnauthorizedException('Reset token expired or invalid');

        const valid = await bcrypt.compare(dto.token, storedHash);
        if (!valid) throw new UnauthorizedException('Reset token expired or invalid');

        const newHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
        await this.prisma.user.update({
            where: { id: dto.userId },
            data: { passwordHash: newHash },
        });

        // Invalidate the reset token and any active refresh tokens
        await this.cache.del(`pwd_reset:${dto.userId}`);
        await this.cache.del(`refresh:${dto.userId}`);
    }

    private async generateTokens(userId: string, email: string, role: string) {
        const payload = { sub: userId, email, role };

        const accessToken = await this.jwt.signAsync(payload, {
            secret: this.config.getOrThrow<string>('jwt.accessSecret'),
            expiresIn: this.config.get<string>('jwt.accessExpiry', '15m'),
        });

        const refreshToken = crypto.randomUUID() + '-' + crypto.randomUUID();
        const refreshHash = await bcrypt.hash(refreshToken, 10);

        const refreshTtlMs = 7 * 24 * 60 * 60; // 7 days
        await this.cache.set(`refresh:${userId}`, refreshHash, refreshTtlMs);

        return { accessToken, refreshToken };
    }
}
