import {
  HttpStatus,
  INestApplication,
  Logger,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as http from 'node:http';
import { AppModule } from 'src/app.module';
import { AuthController } from 'src/modules/auth/auth.controller';
import { SigninResponseDto } from 'src/modules/auth/dto/signin-response.dto';
import { User } from 'src/modules/users/entities/user.entity';
import {
  getCreateUserDto,
  getSiginDto,
} from 'src/modules/users/mocks/user.mock';
import { HttpExceptionFilter } from 'src/shared/exception-filter';
import {
  ControllerResponse,
  TransformInterceptor,
} from 'src/shared/transform.interceptor';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe(AuthController.name, () => {
  let app: INestApplication;
  let nestServer: http.Server;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    const logger = new Logger();

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter(logger));
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();

    nestServer = app.getHttpServer() as http.Server;
    usersRepository = app.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await usersRepository.delete({});
  });

  afterAll(async () => {
    await usersRepository.delete({});
    await app.close();
  });

  describe(AuthController.prototype.signin.name, () => {
    const loginEndpoint = '/auth/login';
    const registerEndpoint = '/auth/register';

    it(`should throw ${UnauthorizedException.name} when user does not exist`, async () => {
      // Arrange
      const payload = getSiginDto();

      // Act
      const response = await request(nestServer)
        .post(loginEndpoint)
        .send(payload);

      // Assert
      expect(response.status).toBe(HttpStatus.UNAUTHORIZED);
    });

    it(`should return auth token when user logins correctly`, async () => {
      // Arrange
      const createUserDto = getCreateUserDto();
      const userCredentials = {
        email: createUserDto.email,
        password: createUserDto.password,
      };

      await request(nestServer).post(registerEndpoint).send(createUserDto);

      // Act
      const response = await request(nestServer)
        .post(loginEndpoint)
        .send(userCredentials);

      const body = response.body as ControllerResponse<SigninResponseDto>;

      // Assert
      expect(response.status).toBe(HttpStatus.OK);
      expect(body.data.accessToken).toBeTruthy();
      expect(body.data.accessToken).toEqual(expect.any(String));
    });

    describe('Invalid fields', () => {
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
          .post(loginEndpoint)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });

  describe(AuthController.prototype.register.name, () => {
    const registerEndpoint = `/auth/register`;

    it(`should return ${HttpStatus.CREATED} when user is created`, async () => {
      // Arrange
      const payload = getCreateUserDto();

      // Act
      const response = await request(nestServer)
        .post(registerEndpoint)
        .send(payload);

      const { data } = response.body as ControllerResponse<User>;

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);
      expect(data.name).toBe(payload.name);
      expect(data.email).toBe(payload.email);
      expect(data).not.toHaveProperty('password');
    });

    it(`should return ${HttpStatus.CONFLICT} when user email already exists`, async () => {
      // Arrange
      const payload = getCreateUserDto();

      // Act
      await request(nestServer).post(registerEndpoint).send(payload);

      const secondResponse = await request(nestServer)
        .post(registerEndpoint)
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
          .post(registerEndpoint)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should return ${HttpStatus.BAD_REQUEST} when email is missing`, async () => {
        // Arrange
        const payload = getCreateUserDto({ email: undefined });

        // Act
        const response = await request(nestServer)
          .post(registerEndpoint)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should return ${HttpStatus.BAD_REQUEST} when name is missing`, async () => {
        // Arrange
        const payload = getCreateUserDto({ name: undefined });

        // Act
        const response = await request(nestServer)
          .post(registerEndpoint)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });
  });
});
