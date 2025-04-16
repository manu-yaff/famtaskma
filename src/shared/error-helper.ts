export interface PostgresDriverError {
  name: string;
  message: string;
  code: string;
  detail: string;
}

export const TyperomDuplicatedKeyErrorCode = '23505';
