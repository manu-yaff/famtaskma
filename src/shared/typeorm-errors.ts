import { QueryFailedError } from 'typeorm';

export interface PostgresDriverError {
  name: string; // error.name from Error
  message: string; // error.message from Error
  code: string; // error.code form Typeorm
  detail: string; // error.detail from Typeorm
}

export const TypeormErrors = {
  duplicateKeyError: '23505',
  invalidSyntaxForType: '22P02',
};

export function duplicateKeyError(key: string) {
  return new QueryFailedError<PostgresDriverError>('INSERT INTO...', [], {
    name: 'QueryFailedError',
    message: 'duplicate key value violates unique constraint ...',
    code: TypeormErrors.duplicateKeyError,
    detail: `Key (${key}) already exists`,
  });
}
