import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        super({
            datasources: {
                db: {
                    url: process.env.DATABASE_URL,
                },
            },
            log: process.env.NODE_ENV === 'development'
                ? [
                    { emit: 'stdout', level: 'query' },
                    { emit: 'stdout', level: 'info' },
                    { emit: 'stdout', level: 'warn' },
                    { emit: 'stdout', level: 'error' },
                ]
                : [{ emit: 'stdout', level: 'error' }],
        });
    }

    async onModuleInit() {
        await this.$connect();

        this.logger.log(
            `Database connected [${process.env.NODE_ENV}] via ${process.env.NODE_ENV === 'production' ? 'PgBouncer :6432' : 'PostgreSQL :5432'
            }`,
        );
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }

    /**
     * Convert Prisma Decimal fields to plain numbers for JSON serialization.
     * Without this, Decimal comes out as { d: [...], e: N, s: 1 } instead of 19.99.
     * Call this on any object before returning it from a service.
     */
    toNumber(value: Prisma.Decimal | null | undefined): number | null {
        if (value === null || value === undefined) return null;
        return value.toNumber();
    }

    /**
     * Generate a human-readable order number: PS-YYYY-NNNNNN
     * Uses a PostgreSQL sequence for atomicity — never duplicates under concurrency.
     * The sequence `order_number_seq` must be created in the initial migration.
     */
    async generateOrderNumber(): Promise<string> {
        const result = await this.$queryRaw<[{ nextval: bigint }]>`
      SELECT nextval('order_number_seq')
    `;
        const seq = Number(result[0].nextval).toString().padStart(6, '0');
        const year = new Date().getFullYear();
        return `PS-${year}-${seq}`;
    }
}
