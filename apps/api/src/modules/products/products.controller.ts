import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ProductFiltersDto } from './dto/product-filters.dto';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Products')
@Controller({ path: 'products', version: '1' })
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'List published products with filters, sort, pagination' })
    findAll(@Query() filters: ProductFiltersDto) {
        return this.productsService.findAll(filters);
    }

    @Public()
    @Get(':slug')
    @ApiOperation({ summary: 'Get a single product by slug' })
    findOne(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }
}
