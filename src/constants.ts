export const DATABASE_TYPE = 'postgres';

export enum CONFIG_KEYS {
  DB_HOST = 'DB_HOST',
  DB_PORT = 'DB_PORT',
  DB_NAME = 'DB_NAME',
  DB_USERNAME = 'DB_USERNAME',
  DB_PASSWORD = 'DB_PASSWORD',

  ENVIRONMENT = 'ENVIRONMENT',

  JWT_SECRET = 'JWT_SECRET',
  JWT_EXPIRES_IN = 'JWT_EXPIRES_IN',
}
