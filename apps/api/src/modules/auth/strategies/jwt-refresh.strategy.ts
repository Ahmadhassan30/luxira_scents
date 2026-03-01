import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface JwtPayload {
    sub: string;
    email: string;
}

/**
 * Extracts the refresh token from the HTTP-only cookie `refresh_token`.
 * This strategy is only used on the /auth/refresh endpoint — not globally.
 * The cookie is never readable by JavaScript, only by the browser on this route.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor(config: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => {
                    const cookies = req.cookies as Record<string, string> | undefined;
                    return cookies?.['refresh_token'] ?? null;
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: config.getOrThrow<string>('jwt.refreshSecret'),
            passReqToCallback: false,
        });
    }

    validate(payload: JwtPayload) {
        return { sub: payload.sub, email: payload.email };
    }
}
