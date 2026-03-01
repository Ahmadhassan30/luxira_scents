import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller({ path: 'orders', version: '1' })
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    create(
        @Body() dto: CreateOrderDto,
        @CurrentUser('sub') userId: string,
    ) {
        return this.ordersService.create(dto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'List orders for the authenticated user' })
    findAll(@CurrentUser('sub') userId: string) {
        return this.ordersService.findByUser(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get order details by ID' })
    findOne(@Param('id') id: string, @CurrentUser('sub') userId: string) {
        return this.ordersService.findById(id, userId);
    }
}
