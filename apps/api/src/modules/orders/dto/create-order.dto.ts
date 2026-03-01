import { IsArray, IsOptional, IsUUID, IsString, IsInt, Min, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class OrderItemDto {
    @ApiProperty()
    @IsUUID()
    variantId: string;

    @ApiProperty({ minimum: 1 })
    @IsInt()
    @Min(1)
    quantity: number;
}

export class CreateOrderDto {
    @ApiProperty({ type: [OrderItemDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    shippingAddressId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    couponCode?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    guestEmail?: string;
}
