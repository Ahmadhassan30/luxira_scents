import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

/**
 * Typed Redis wrapper.
 *
 * IMPORTANT — cache is fail-open:
 * All get/set/del methods catch Redis errors internally and return null/void.
 * This means if Redis is unavailable, API requests continue normally with a
 * database fallback. Callers must handle `null` from get() as "cache miss — query DB".
 * Do NOT assume a non-null get() response is always up-to-date — TTLs govern freshness.
 */
@Injectable()
export class CacheService implements OnModuleDestroy {
    private readonly redis: Redis;
    private readonly logger = new Logger(CacheService.name);

    constructor(private config: ConfigService) {
        this.redis = new Redis({
            host: this.config.getOrThrow<string>('redis.host'),
            port: this.config.getOrThrow<number>('redis.port'),
            password: this.config.get<string>('redis.password'),
            connectTimeout: 5000,
            commandTimeout: 3000,
            retryStrategy: (times) => Math.min(times * 100, 3000),
            maxRetriesPerRequest: 3,
        });
        this.redis.on('connect', () => this.logger.log('Redis connected'));
        this.redis.on('error', (err) => this.logger.error('Redis error', err.message));
    }

    /**
     * Returns null on cache miss OR on Redis error (fail-open).
     * Callers must always fall through to database on null.
     */
    async get<T>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            if (!value) return null;
            return JSON.parse(value) as T;
        } catch (err) {
            this.logger.error(`Cache get failed for key "${key}"`, (err as Error).message);
            return null; // fail-open: let the caller hit the DB
        }
    }

    async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
        try {
            const serialized = JSON.stringify(value);
            if (ttlSeconds) {
                await this.redis.setex(key, ttlSeconds, serialized);
            } else {
                await this.redis.set(key, serialized);
            }
        } catch (err) {
            this.logger.error(`Cache set failed for key "${key}"`, (err as Error).message);
            // fail-open: write failure is non-fatal
        }
    }

    async del(key: string): Promise<void> {
        try {
            await this.redis.del(key);
        } catch (err) {
            this.logger.error(`Cache del failed for key "${key}"`, (err as Error).message);
        }
    }

    async delByPattern(pattern: string): Promise<void> {
        try {
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) await this.redis.del(...keys);
        } catch (err) {
            this.logger.error(`Cache delByPattern failed for pattern "${pattern}"`, (err as Error).message);
        }
    }

    async ping(): Promise<boolean> {
        try {
            return (await this.redis.ping()) === 'PONG';
        } catch {
            return false;
        }
    }

    onModuleDestroy() {
        this.redis.disconnect();
    }
}
