import { IsOptional, IsUUID, IsString, IsEnum, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum ProductSortBy {
    NEWEST = 'newest',
    PRICE_ASC = 'price_asc',
    PRICE_DESC = 'price_desc',
    NAME_ASC = 'name_asc',
}

export class ProductFiltersDto {
    @ApiProperty({ required: false, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiProperty({ required: false, default: 20 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limit?: number = 20;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsUUID()
    categoryId?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    scentFamily?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    gender?: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiProperty({ required: false, enum: ProductSortBy })
    @IsOptional()
    @IsEnum(ProductSortBy)
    sortBy?: ProductSortBy = ProductSortBy.NEWEST;
}
