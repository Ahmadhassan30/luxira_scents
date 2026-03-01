import { Controller, Get, Patch, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { AdminOrdersService } from './admin-orders.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@perfume/shared';

class UpdateStatusDto { @IsString() status: string; }
class UpdateTrackingDto {
    @IsString() trackingNumber: string;
    @IsString() trackingCarrier: string;
}

@ApiTags('Admin / Orders')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller({ path: 'admin/orders', version: '1' })
export class AdminOrdersController {
    constructor(private readonly service: AdminOrdersService) { }

    @Get()
    @ApiOperation({ summary: '(Admin) List all orders' })
    findAll(@Query('page') page = 1, @Query('limit') limit = 50) {
        return this.service.findAll(+page, +limit);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: '(Admin) Update order status' })
    updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto) {
        return this.service.updateStatus(id, dto.status);
    }

    @Patch(':id/tracking')
    @ApiOperation({ summary: '(Admin) Set tracking info and mark as SHIPPED' })
    updateTracking(@Param('id') id: string, @Body() dto: UpdateTrackingDto) {
        return this.service.updateTracking(id, dto.trackingNumber, dto.trackingCarrier);
    }
}
