# Famtaskma

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

Drop schema

```bash
$ npm run typeorm schema:drop
```

Create empty migration file

```bash
$ npm run migration:create --name=MyMigration
```

Generate migration file from schema changes (entity files changes)

```bash
$ npm run migration:generate --name=MyMigration
```

Revert migration

```bash
$ npm run migration:revert
```

Run migrations

```bash
npm run migration:run
```
