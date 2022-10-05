import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { ForbiddenError } from '@casl/ability';

@Catch(ForbiddenError)
export class AbilityExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const httpStatus = exception instanceof ForbiddenError ? 403 : 500;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const message = exception.message;

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message: message,
    });
  }
}
