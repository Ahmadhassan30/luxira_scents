# Luxira Scents — E-Commerce Monorepo

Production-ready, fully typed, scalable e-commerce platform for a luxury perfume brand.

## Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo |
| Backend | NestJS 10, TypeScript, Prisma 5 |
| Frontend | Next.js 14 (App Router), Tailwind CSS |
| Database | PostgreSQL 16 |
| Connection Pool | PgBouncer (transaction mode) |
| Cache | Redis 7 via ioredis |
| Payments | Stripe (Elements + Webhooks) |
| Email | Resend + React Email |
| Image CDN | Cloudinary |
| Process Manager | PM2 cluster |
| Reverse Proxy | Nginx |
| Auth | JWT (memory) + HTTP-only cookie refresh |

## Environment Strategy

| | Development | Production (Hostinger VPS) |
|---|---|---|
| PostgreSQL | localhost:5432 (native or Docker) | localhost:5432 (native) |
| Redis | localhost:6379 | localhost:6379 |
| PgBouncer | NOT used | localhost:6432 — app connects here |
| Next.js | `next dev` | PM2 cluster, `next start` |
| NestJS | `nest start --watch` | PM2 cluster, compiled JS |

One `DATABASE_URL` change separates dev from prod. Nothing else changes.

## Project Structure

```
luxira-scents/
├── apps/
│   ├── api/                    # NestJS backend
│   │   ├── prisma/             # Schema, migrations, seed
│   │   └── src/
│   │       ├── common/         # Guards, filters, interceptors, decorators
│   │       ├── config/         # Typed config factories
│   │       ├── modules/        # Feature modules (auth, products, orders, ...)
│   │       └── prisma/         # PrismaModule + PrismaService
│   └── web/                    # Next.js frontend
│       ├── app/                # App Router pages (shop, auth, account, api)
│       ├── components/         # UI, layout, product components
│       ├── hooks/              # React hooks (useAuth, useCart, useProducts)
│       ├── lib/                # api, utils, stripe, cloudinary, auth
│       └── store/              # Zustand stores (cart, auth, ui)
├── packages/
│   ├── shared/                 # Shared types, schemas, constants
│   └── email-templates/        # React Email templates
└── infra/
    ├── docker/                 # Dockerfiles (api, web)
    ├── nginx/                  # nginx.conf + site config
    ├── pm2/                    # ecosystem.config.js
    └── scripts/                # setup-vps.sh
```

## Getting Started

### Prerequisites
- Node.js 20, npm 10
- PostgreSQL 16 running on `localhost:5432`
- Redis 7 running on `localhost:6379`

### Install

```bash
git clone <repo-url> luxira-scents
cd luxira-scents
npm install
```

### Configure Environment

```bash
# API
cp apps/api/.env.example apps/api/.env
# Fill in DATABASE_URL, JWT secrets, Stripe keys, etc.

# Web
cp apps/web/.env.example apps/web/.env.local
# Fill in NEXT_PUBLIC_API_URL, Stripe publishable key, etc.
```

### Database Setup

```bash
cd apps/api

# Run migrations (creates all tables + order_number_seq sequence)
npx prisma migrate deploy

# Seed the database (admin user, categories, sample product, coupon)
npx prisma db seed
```

### Development

```bash
# From root — runs both apps in parallel
npm run dev
```

- API: http://localhost:4000
- Web: http://localhost:3000
- Swagger: http://localhost:4000/api/docs (development only)

## Security Architecture

### JWT Token Strategy
- **Access token**: Short-lived (15m), stored in Zustand memory state only. Cleared on page reload.
- **Refresh token**: Long-lived (7d), stored as `HttpOnly; Secure; SameSite=Lax` cookie on `/api/v1/auth`. JavaScript cannot read this.
- **Silent refresh**: On page load, app calls `POST /auth/refresh`; browser sends cookie automatically, returns new access token.
- **Revocation**: Logout deletes the refresh token hash from Redis. Token is immediately invalid.

### PgBouncer + Prisma
- Runtime: `DATABASE_URL` → PgBouncer `:6432` with `?pgbouncer=true&connection_limit=1`
- Migrations: `DATABASE_DIRECT_URL` → PostgreSQL `:5432` directly (bypasses PgBouncer; required because `prisma migrate` uses session-level commands incompatible with transaction pooling)

### Stripe Webhook
- `main.ts` applies `express.raw()` to `/api/v1/payments/webhook` **before** JSON middleware
- `StripeWebhookController` calls `stripe.webhooks.constructEvent()` with the raw buffer
- HMAC signature verification rejects any request not from Stripe

### Other Security Notes
- ISR revalidation (`/api/revalidate`) validates `x-revalidation-secret` header
- Soft-delete on User: Prisma middleware auto-adds `WHERE deletedAt IS NULL` to all User queries
- Decimal serialization: `PrismaService.toNumber()` converts Prisma `Decimal` to `number` before responses
- PostgreSQL `order_number_seq` generates human-readable atomic order numbers (`PS-YYYY-NNNNNN`)
- Redis fail-open: cache errors return `null` without crashing — callers fall through to DB
- VPS backup cron uses `.pgpass` for DB auth — no plaintext passwords in crontab

## Production Deployment

```bash
# 1. Provision VPS (Ubuntu 22.04)
chmod +x infra/scripts/setup-vps.sh
sudo ./infra/scripts/setup-vps.sh

# 2. Point DNS to VPS IP, then get SSL cert
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 3. Configure prod .env files on the VPS

# 4. Run migrations (uses DATABASE_DIRECT_URL, bypasses PgBouncer)
cd /var/www/luxira
DATABASE_URL=$DATABASE_DIRECT_URL npx prisma migrate deploy --schema=apps/api/prisma/schema.prisma

# 5. Build & start
npx turbo build
pm2 start infra/pm2/ecosystem.config.js --env production
pm2 save
```

## Key Commands

| Command | Description |
|---|---|
| `npm run dev` | Start all apps in development |
| `npm run build` | Build all apps via Turborepo |
| `npm run type-check` | TypeScript check across monorepo |
| `npm run lint` | ESLint across monorepo |
| `npx prisma migrate dev` | Create & apply a new migration |
| `npx prisma db seed` | Seed database |
| `npx prisma studio` | Open Prisma data browser |
| `pm2 reload ecosystem.config.js` | Zero-downtime reload production |
