import { Module } from '@nestjs/common';
import { CouponsController } from './coupons.controller';
import { CouponsService } from './coupons.service';

@Module({
    providers: [CouponsService],
    controllers: [CouponsController],
    exports: [CouponsService],
})
export class CouponsModule { }
