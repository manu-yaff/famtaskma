import {
  BadRequestException,
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PostgresDriverError, TypeormErrors } from 'src/shared/typeorm-errors';
import { EntityNotFoundError, QueryFailedError, TypeORMError } from 'typeorm';

/**
 * Received an error and maps it to an http exception in a format useful for
 * the exception filter
 * @param error
 * @returns HttpException
 */
export function mapErrorToHttpException(error: unknown) {
  // means, it has already been format, so just re-throw
  if (error instanceof HttpException) {
    throw error;
  }

  // handle database errors
  if (error instanceof TypeORMError) {
    const { message, ...rest } = error;

    const errorResponse = {
      message,
      detail: rest,
    };

    if (error instanceof EntityNotFoundError) {
      return new NotFoundException(errorResponse);
    }

    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as PostgresDriverError;

      if (driverError.code === TypeormErrors.duplicateKeyError) {
        return new ConflictException(errorResponse);
      }

      if (driverError.code === TypeormErrors.invalidSyntaxForType) {
        return new BadRequestException(errorResponse);
      }
    }
  }

  // for unknown errors
  if (error instanceof Error) {
    return new InternalServerErrorException({
      message: error.message,
      detail: error.cause,
    });
  }

  throw error;
}
