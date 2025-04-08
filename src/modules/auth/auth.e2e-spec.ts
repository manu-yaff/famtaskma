import {
  HttpStatus,
  INestApplication,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as http from 'node:http';
import { DatabaseConfigModule } from 'src/database/database.module';
import { AuthController } from 'src/modules/auth/auth.controller';
import { AuthModule } from 'src/modules/auth/auth.module';
import { SigninDto } from 'src/modules/auth/dto/signin-input';
import { User } from 'src/modules/users/entities/user.entity';
import { getCreateUserDto } from 'src/modules/users/mocks/create-user.input.mock';
import { UsersModule } from 'src/modules/users/users.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe(AuthController.name, () => {
  let app: INestApplication;
  let nestServer: http.Server;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        UsersModule,
        DatabaseConfigModule,
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        AuthModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    nestServer = app.getHttpServer() as http.Server;
    usersRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await usersRepository.clear();
  });

  afterAll(async () => {
    await usersRepository.clear();
    await app.close();
  });

  describe(AuthController.prototype.signin.name, () => {
    it(`should throw ${UnauthorizedException.name} when user does not exist`, async () => {
      // Arrange
      const payload: SigninDto = {
        email: 'jonh@gmail.com',
        password: 'secret-pass',
      };

      // Act
      const response = await request(nestServer)
        .post('/auth/login')
        .send(payload);

      // Assert
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`should return auth token when user logins correclty`, async () => {
      // Arrange
      const createUserDto = getCreateUserDto();
      const userCredentials = {
        email: createUserDto.email,
        password: createUserDto.password,
      };

      await request(nestServer).post('/users/register').send(createUserDto);

      // Act
      const response = await request(nestServer)
        .post('/auth/login')
        .send(userCredentials);

      const body = response.body as Record<string, string>;

      // Assert
      expect(response.status).toBe(HttpStatus.OK);
      expect(body.accessToken).toBeTruthy();
      expect(body.accessToken).toEqual(expect.any(String));
    });

    describe('invalid fields', () => {
      it('should throw error when email is missing', async () => {
        // Arrange

        // Act
        const response = await request(nestServer).post('/auth/login').send({
          password: 'secret',
        });

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it('should throw error when password is missing', async () => {
        // Arrange
        const payload = {
          email: 'jonh@gmail.com',
        };

        // Act
        const response = await request(nestServer)
          .post('/auth/login')
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
