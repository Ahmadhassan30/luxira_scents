import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as Record<string, unknown>;

        const body = {
            status: 'error',
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: Array.isArray(exceptionResponse?.message)
                ? (exceptionResponse.message as string[])[0]
                : ((exceptionResponse?.message as string) ?? exception.message),
            errors: Array.isArray(exceptionResponse?.message)
                ? (exceptionResponse.message as string[]).map((msg: string) => ({ message: msg }))
                : undefined,
        };

        if (status >= 500) {
            this.logger.error(`${request.method} ${request.url} ${status}`, exception.stack);
        }

        response.status(status).json(body);
    }
}
