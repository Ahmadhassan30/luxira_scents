import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString, IsNumber, Min } from 'class-validator';
import { CouponsService } from './coupons.service';

class ValidateCouponDto {
    @IsString()
    code: string;

    @IsNumber()
    @Min(0)
    subtotal: number;
}

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller({ path: 'coupons', version: '1' })
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @Post('validate')
    @ApiOperation({ summary: 'Validate a coupon code and get discount amount' })
    validate(@Body() dto: ValidateCouponDto) {
        return this.couponsService.validate(dto.code, dto.subtotal);
    }
}
