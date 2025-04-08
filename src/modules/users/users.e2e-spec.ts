import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as http from 'node:http';
import { DatabaseConfigModule } from 'src/database/database.module';
import { User } from 'src/modules/users/entities/user.entity';
import { getCreateUserDto } from 'src/modules/users/mocks/create-user.input.mock';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersModule } from 'src/modules/users/users.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe(UsersController.name, () => {
  let app: INestApplication;
  let usersRepository: Repository<User>;
  let nestServer: http.Server;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        DatabaseConfigModule,
        UsersModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    usersRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    nestServer = app.getHttpServer() as http.Server;
  });

  beforeEach(async () => {
    await usersRepository.clear();
  });

  afterAll(async () => {
    await usersRepository.clear();
    await app.close();
  });

  describe(`POST /users`, () => {
    it(`should return ${HttpStatus.CREATED} when user is created`, async () => {
      // Arrange
      const payload = getCreateUserDto();

      // Act
      const response = await request(nestServer)
        .post('/users/register')
        .send(payload);

      const body = response.body as User;

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(body.name).toBe(payload.name);
      expect(body.email).toBe(payload.email);
      expect(body).not.toHaveProperty('password');
    });

    it(`should return ${HttpStatus.CONFLICT} when user email already exists`, async () => {
      // Arrange
      const payload = getCreateUserDto();

      // Act
      await request(nestServer).post('/users/register').send(payload);

      const secondResponse = await request(nestServer)
        .post('/users/register')
        .send(payload);

      // Assert
      expect(secondResponse.status).toBe(HttpStatus.CONFLICT);
    });

    describe(`Invalid fields`, () => {
      it(`should return ${HttpStatus.BAD_REQUEST} when password is missing`, async () => {
        // Arrange
        const payload = getCreateUserDto({ password: undefined });

        // Act
        const response = await request(nestServer)
          .post('/users/register')
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should return ${HttpStatus.BAD_REQUEST} when email is missing`, async () => {
        // Arrange
        const payload = getCreateUserDto({ email: undefined });

        // Act
        const response = await request(nestServer)
          .post('/users/register')
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should return ${HttpStatus.BAD_REQUEST} when name is missing`, async () => {
        // Arrange
        const payload = getCreateUserDto({ name: undefined });

        // Act
        const response = await request(nestServer)
          .post('/users/register')
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
