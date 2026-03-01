import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
    // Fix: disable global body parser so we can apply raw body for Stripe webhooks
    const app = await NestFactory.create(AppModule, {
        bodyParser: false,
        logger:
            process.env.NODE_ENV === 'production'
                ? ['error', 'warn']
                : ['error', 'warn', 'log', 'debug'],
    });

    // Fix: raw body MUST come before JSON parsing for the Stripe webhook route.
    // Stripe signature verification requires the original unparsed bytes.
    // Once Express converts the body to JSON the hmac will never match.
    app.use(
        '/api/v1/payments/webhook',
        express.raw({ type: 'application/json' }),
    );

    // JSON parsing for every other route
    app.use(express.json({ limit: '5mb' }));
    app.use(express.urlencoded({ extended: true, limit: '5mb' }));

    // Versioned API prefix: /api/v1/...
    app.setGlobalPrefix('api');
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    // CORS — only accept requests from the configured frontend URL
    app.enableCors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    // Global validation — strip unknown fields, auto-transform to DTO instances
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // Global exception filters (runs in reverse order: Prisma handled first, then HTTP)
    app.useGlobalFilters(new HttpExceptionFilter(), new PrismaExceptionFilter());

    // Global interceptors
    const reflector = app.get(Reflector);
    app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor(reflector));

    // Swagger — development only. Never expose in production.
    if (process.env.NODE_ENV !== 'production') {
        const config = new DocumentBuilder()
            .setTitle('Luxira Scents API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        SwaggerModule.setup('api/docs', app, SwaggerModule.createDocument(app, config));
        console.warn(`Swagger: http://localhost:${process.env.PORT ?? 4000}/api/docs`);
    }

    const port = process.env.PORT ?? 4000;
    await app.listen(port);
    console.warn(`API running on :${port} [${process.env.NODE_ENV}]`);
}

bootstrap();
