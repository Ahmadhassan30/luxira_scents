import {
    IsString, IsOptional, IsEnum, IsArray, IsUUID,
    MinLength, IsBoolean,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from '@perfume/shared';

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    @MinLength(2)
    name: string;

    @ApiProperty()
    @IsString()
    slug: string;

    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ enum: ProductStatus, required: false })
    @IsOptional()
    @IsEnum(ProductStatus)
    status?: ProductStatus;

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

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    topNotes?: string[];

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    middleNotes?: string[];

    @ApiProperty({ type: [String], required: false })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    baseNotes?: string[];
}
