import {
    Controller,
    Post,
    Get,
    Body,
    Res,
    Req,
    HttpCode,
    HttpStatus,
    UseGuards,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtRefreshGuard } from '../../common/guards/jwt-refresh.guard';

const REFRESH_COOKIE_OPTIONS = {
    httpOnly: true,          // JavaScript cannot read this cookie — prevents XSS token theft
    secure: process.env.NODE_ENV === 'production',  // HTTPS only in prod
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    path: '/api/v1/auth',            // narrow scope — only sent on auth routes
};

@ApiTags('Auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Register a new customer account' })
    async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken, user } = await this.authService.register(dto);
        res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);
        return { accessToken, user };
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ auth: { ttl: 60000, limit: 10 } })
    @ApiOperation({ summary: 'Login with email and password' })
    async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        const { accessToken, refreshToken, user } = await this.authService.login(dto);
        res.cookie('refresh_token', refreshToken, REFRESH_COOKIE_OPTIONS);
        return { accessToken, user };
    }

    /** Silent refresh — browser sends HTTP-only cookie automatically.
     *  Returns a new short-lived access token.
     *  Called on page load if in-memory token is gone (e.g. after browser refresh). */
    @Public()
    @UseGuards(JwtRefreshGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Silently refresh access token using HTTP-only refresh cookie' })
    async refresh(
        @CurrentUser() user: { sub: string; email: string },
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ) {
        const refreshToken = (req.cookies as Record<string, string>)['refresh_token'];
        const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshTokens(
            user.sub,
            refreshToken,
        );
        res.cookie('refresh_token', newRefreshToken, REFRESH_COOKIE_OPTIONS);
        return { accessToken };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and clear the refresh token cookie' })
    async logout(
        @CurrentUser('sub') userId: string,
        @Res({ passthrough: true }) res: Response,
    ) {
        await this.authService.logout(userId);
        res.clearCookie('refresh_token', { path: '/api/v1/auth' });
        return { message: 'Logged out successfully' };
    }

    @Get('me')
    @ApiOperation({ summary: 'Get the currently authenticated user' })
    me(@CurrentUser() user: { sub: string; email: string; role: string }) {
        return user;
    }
}
