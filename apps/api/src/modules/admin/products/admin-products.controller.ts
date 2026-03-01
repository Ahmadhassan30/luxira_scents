import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminProductsService } from './admin-products.service';
import { CreateProductDto } from '../../products/dto/create-product.dto';
import { UpdateProductDto } from '../../products/dto/update-product.dto';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@perfume/shared';

@ApiTags('Admin / Products')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller({ path: 'admin/products', version: '1' })
export class AdminProductsController {
    constructor(private readonly service: AdminProductsService) { }

    @Get()
    @ApiOperation({ summary: '(Admin) List all products' })
    findAll() { return this.service.findAll(); }

    @Post()
    @ApiOperation({ summary: '(Admin) Create a product' })
    create(@Body() dto: CreateProductDto) { return this.service.create(dto); }

    @Patch(':id')
    @ApiOperation({ summary: '(Admin) Update a product' })
    update(@Param('id') id: string, @Body() dto: UpdateProductDto) { return this.service.update(id, dto); }

    @Delete(':id')
    @ApiOperation({ summary: '(Admin) Archive a product' })
    remove(@Param('id') id: string) { return this.service.remove(id); }
}
