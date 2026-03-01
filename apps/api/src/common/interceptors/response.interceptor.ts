import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Reflector } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly reflector: Reflector) { }

    intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
        return next.handle().pipe(
            map((data) => ({
                status: 'success',
                data: data?.data !== undefined ? data.data : data,
                meta: data?.meta ?? undefined,
            })),
        );
    }
}
