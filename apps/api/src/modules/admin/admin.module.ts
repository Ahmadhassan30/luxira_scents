import { Module } from '@nestjs/common';
import { AdminProductsController } from './products/admin-products.controller';
import { AdminProductsService } from './products/admin-products.service';
import { AdminOrdersController } from './orders/admin-orders.controller';
import { AdminOrdersService } from './orders/admin-orders.service';
import { AnalyticsController } from './analytics/analytics.controller';
import { AnalyticsService } from './analytics/analytics.service';

@Module({
    providers: [AdminProductsService, AdminOrdersService, AnalyticsService],
    controllers: [AdminProductsController, AdminOrdersController, AnalyticsController],
})
export class AdminModule { }
