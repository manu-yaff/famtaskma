import { QueryFailedError } from 'typeorm';

export interface PostgresDriverError {
  name: string;
  message: string;
  code: string;
  detail: string;
}

export const TyperomDuplicatedKeyErrorCode = '23505';

export function duplicateKeyError(key: string) {
  return new QueryFailedError<PostgresDriverError>('INSERT INTO...', [], {
    name: 'QueryFailedError',
    message: 'duplicate key value violates unique constraint ...',
    code: TyperomDuplicatedKeyErrorCode,
    detail: `Key (${key}) already exists`,
  });
}
