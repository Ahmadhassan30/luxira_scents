import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import appConfig from './config/app.config';
import databaseConfig from './config/database.config';
import jwtConfig from './config/jwt.config';
import redisConfig from './config/redis.config';
import stripeConfig from './config/stripe.config';
import cloudinaryConfig from './config/cloudinary.config';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './modules/cache/cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { MailModule } from './modules/mail/mail.module';
import { AdminModule } from './modules/admin/admin.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [appConfig, databaseConfig, jwtConfig, redisConfig, stripeConfig, cloudinaryConfig],
            envFilePath: process.env.NODE_ENV === 'production' ? '.env.production' : '.env',
        }),
        ThrottlerModule.forRoot([
            { name: 'auth', ttl: 60000, limit: 10 },
            { name: 'default', ttl: 60000, limit: 100 },
        ]),
        PrismaModule,
        CacheModule,
        MailModule,
        AuthModule,
        UsersModule,
        ProductsModule,
        CategoriesModule,
        OrdersModule,
        InventoryModule,
        CouponsModule,
        UploadsModule,
        PaymentsModule,
        AdminModule,
    ],
    controllers: [AppController],
    providers: [
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: RolesGuard },
        { provide: APP_GUARD, useClass: ThrottlerGuard },
    ],
})
export class AppModule { }
