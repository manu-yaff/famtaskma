import {
  ConflictException,
  HttpException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TyperomDuplicatedKeyErrorCode } from 'src/constants';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export interface PostgresDriverError {
  name: string;
  message: string;
  code: string;
  detail: string;
}

export function mapErrorToHttpException(error: unknown): HttpException {
  if (error instanceof HttpException) throw error;

  if (error instanceof QueryFailedError) {
    const driverError = error.driverError as PostgresDriverError;

    if (driverError.code === TyperomDuplicatedKeyErrorCode) {
      return new ConflictException();
    }
  }

  if (error instanceof EntityNotFoundError) {
    return new NotFoundException();
  }

  return new InternalServerErrorException();
}
