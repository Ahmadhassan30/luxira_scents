import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PrismaService } from './prisma/prisma.service';
import { CacheService } from './modules/cache/cache.service';
import { Public } from './common/decorators/public.decorator';

@ApiTags('Health')
@Controller()
export class AppController {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cache: CacheService,
    ) { }

    @Public()
    @Get('health')
    async health() {
        const dbOk = await this.prisma
            .$queryRaw`SELECT 1`
            .then(() => true)
            .catch(() => false);

        const redisOk = await this.cache.ping();

        return {
            status: dbOk && redisOk ? 'ok' : 'degraded',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            services: {
                database: dbOk ? 'ok' : 'error',
                redis: redisOk ? 'ok' : 'error',
            },
            uptime: Math.floor(process.uptime()),
        };
    }
}
