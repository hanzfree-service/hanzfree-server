import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
export interface CommonResponse<T> {
  status: number;
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
          status: statusCode,
          success: statusCode >= 200 && statusCode < 300,
          data: data,
        };
      }),
      catchError((error) => {
        let response;
        if (error instanceof HttpException) {
          const status = error.getStatus();
          response = {
            status: status,
            success: false,
            data: error.getResponse()['message'] || error.message,
          };
        } else {
          response = {
            status: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            data: 'Internal server error',
          };
        }

        // console.log('response', response);
        // console.log('response.status', response.status);
        // return throwError(() => new HttpException(response, response.status));
        return of(response);
      }),
    );
  }
}
