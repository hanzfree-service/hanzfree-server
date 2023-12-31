import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface CommonResponse<T> {
  code: number;
  success: boolean;
  data: T;
}

@Injectable()
export class ApiResponseInterceptor<T>
  implements NestInterceptor<T, CommonResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CommonResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        const httpContext = context.switchToHttp();
        const httpResponse = httpContext.getResponse();
        const statusCode = httpResponse.statusCode;

        return {
          code: statusCode,
          success: statusCode >= 200 && statusCode < 300,
          data: data,
        };
      }),
    );
  }
}
