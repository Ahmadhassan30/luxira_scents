import { Controller, Get, Patch, Delete, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@Controller({ path: 'users', version: '1' })
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    getProfile(@CurrentUser('sub') userId: string) {
        return this.usersService.findById(userId);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    updateProfile(@CurrentUser('sub') userId: string, @Body() dto: UpdateUserDto) {
        return this.usersService.update(userId, dto);
    }

    @Delete('me')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Soft-delete the current user account' })
    deleteAccount(@CurrentUser('sub') userId: string) {
        return this.usersService.softDelete(userId);
    }

    @Get('me/addresses')
    @ApiOperation({ summary: 'Get saved addresses' })
    getAddresses(@CurrentUser('sub') userId: string) {
        return this.usersService.findAddresses(userId);
    }
}
