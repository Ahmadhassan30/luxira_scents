import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '@perfume/shared';

@ApiTags('Admin / Analytics')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.SUPER_ADMIN)
@Controller({ path: 'admin/analytics', version: '1' })
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('dashboard')
    @ApiOperation({ summary: '(Admin) Get dashboard summary metrics' })
    getDashboard() {
        return this.analyticsService.getDashboard();
    }
}
