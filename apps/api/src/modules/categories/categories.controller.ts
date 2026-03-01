import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('Categories')
@Controller({ path: 'categories', version: '1' })
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'List all product categories' })
    findAll() {
        return this.categoriesService.findAll();
    }

    @Public()
    @Get(':slug')
    @ApiOperation({ summary: 'Get a category by slug' })
    findOne(@Param('slug') slug: string) {
        return this.categoriesService.findBySlug(slug);
    }
}
