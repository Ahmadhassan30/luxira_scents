import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.warn('🌱 Seeding database...');

    // Create the PostgreSQL sequence for human-readable order numbers.
    // This runs before any orders are created and is idempotent.
    // Format: PS-YYYY-NNNNNN (e.g. PS-2026-000001)
    await prisma.$executeRaw`
    CREATE SEQUENCE IF NOT EXISTS order_number_seq
    START WITH 1 INCREMENT BY 1 NO MAXVALUE CACHE 1
  `;

    // Admin user
    const adminHash = await bcrypt.hash('Admin123!', 12);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@luxirascents.com' },
        update: {},
        create: {
            email: 'admin@luxirascents.com',
            passwordHash: adminHash,
            role: 'ADMIN',
            firstName: 'Luxira',
            lastName: 'Admin',
        },
    });
    console.warn(`Admin user: ${admin.email}`);

    // Categories
    const categories = await Promise.all([
        prisma.category.upsert({
            where: { slug: 'oud' },
            update: {},
            create: { name: 'Oud', slug: 'oud', description: 'Rich, woody oud fragrances' },
        }),
        prisma.category.upsert({
            where: { slug: 'floral' },
            update: {},
            create: { name: 'Floral', slug: 'floral', description: 'Light and elegant floral scents' },
        }),
        prisma.category.upsert({
            where: { slug: 'citrus' },
            update: {},
            create: { name: 'Citrus', slug: 'citrus', description: 'Fresh and vibrant citrus notes' },
        }),
    ]);
    console.warn(`Categories: ${categories.map((c) => c.name).join(', ')}`);

    // Sample product
    const product = await prisma.product.upsert({
        where: { slug: 'amber-noir' },
        update: {},
        create: {
            name: 'Amber Noir',
            slug: 'amber-noir',
            description: 'A deep, mysterious blend of amber and oud with hints of black pepper.',
            status: 'PUBLISHED',
            categoryId: categories[0].id,
            scentFamily: 'Oriental',
            gender: 'Unisex',
            topNotes: ['Black Pepper', 'Bergamot'],
            middleNotes: ['Rose', 'Saffron'],
            baseNotes: ['Oud', 'Amber', 'Sandalwood'],
            variants: {
                create: [
                    { sizeMl: 30, price: 49.99, sku: 'AMBNR-30', stockQuantity: 100, isDefault: false },
                    { sizeMl: 50, price: 79.99, sku: 'AMBNR-50', stockQuantity: 50, isDefault: true },
                    { sizeMl: 100, price: 129.99, sku: 'AMBNR-100', stockQuantity: 25, isDefault: false },
                ],
            },
        },
    });
    console.warn(`Product: ${product.name}`);

    // Sample coupon
    await prisma.coupon.upsert({
        where: { code: 'WELCOME10' },
        update: {},
        create: {
            code: 'WELCOME10',
            type: 'PERCENTAGE',
            value: 10,
            minOrderValue: 50,
            isActive: true,
            expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        },
    });
    console.warn('Coupon: WELCOME10 (10% off, min $50)');

    console.warn('✅ Seeding complete');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
