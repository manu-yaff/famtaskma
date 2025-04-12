import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  LoggerService,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const errorDetails = exception.getResponse();

    this.logger.error(
      `[${request.method} - ${request.originalUrl}] Status ${status} - ${exception.message}`,
    );

    const exceptionResponseBody = {
      error: true,
      errorDetails,
    };

    response.status(status).send(exceptionResponseBody);
  }
}
