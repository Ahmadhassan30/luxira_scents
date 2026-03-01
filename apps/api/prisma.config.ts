/**
 * Prisma v7+ configuration file.
 * This file is used by the Prisma CLI (prisma migrate, prisma generate, prisma studio).
 *
 * IMPORTANT — PgBouncer separation in Prisma v7:
 *
 * - `datasource.url` here = URL for MIGRATE commands (dev + prod).
 *   Must be a DIRECT connection to PostgreSQL, NOT through PgBouncer.
 *   PgBouncer transaction pooling mode blocks the session-level commands
 *   that `prisma migrate` relies on (SET, advisory locks, etc.).
 *
 * - PrismaClient runtime URL (for API queries) = set in PrismaService constructor
 *   via `new PrismaClient({ datasource: { url: process.env.DATABASE_URL } })`.
 *   In production this points to PgBouncer :6432 with ?pgbouncer=true&connection_limit=1.
 *
 * So: cli uses DATABASE_DIRECT_URL (PostgreSQL :5432)
 *     runtime uses DATABASE_URL (PgBouncer :6432 in prod, PostgreSQL :5432 in dev)
 */
import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        // Use the DIRECT url for Prisma CLI — bypasses PgBouncer
        url: env('DATABASE_DIRECT_URL'),
    },
});
