import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';
import { SigninDto } from 'src/modules/auth/dto/signin-input';
import { getJwtServiceMock } from 'src/modules/auth/mocks/jwt.service.mock';
import { getUserEntityMock } from 'src/modules/users/mocks/user.entity.mock';
import { getUsersServiceMock } from 'src/modules/users/mocks/users.service.mock';
import { UsersService } from 'src/modules/users/users.service';

describe(AuthService.name, () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: getUsersServiceMock(),
        },
        {
          provide: JwtService,
          useValue: getJwtServiceMock(),
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe(AuthService.prototype.signin.name, () => {
    it('should return auth token when user is authenticated correctly', async () => {
      // Arrange
      const jwtTokenMock = 'jwt-token';
      const userMock = getUserEntityMock();
      const payload: SigninDto = {
        email: 'jonh@gmail.com',
        password: 'jonh@gmail.com',
      };

      jest.spyOn(jwtService, 'signAsync').mockResolvedValue(jwtTokenMock);
      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(userMock);
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      // Act
      const result = await authService.signin(payload);

      // Assert
      expect(result.accessToken).toBeTruthy();
      expect(result.accessToken).toEqual(jwtTokenMock);
    });

    it(`should throw ${UnauthorizedException.name} when user provides invalid credentials`, async () => {
      // Arrange
      const userMock = getUserEntityMock();

      const payload: SigninDto = {
        email: 'jonh@gmail.com',
        password: 'secret-password',
      };

      jest.spyOn(usersService, 'findOneByEmail').mockResolvedValue(userMock);

      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      // Act
      const promise = authService.signin(payload);

      // Assert
      await expect(() => promise).rejects.toThrow(UnauthorizedException);
    });

    it(`should throw ${UnauthorizedException.name} when user is not found`, async () => {
      // Arrange
      const payload: SigninDto = {
        email: '',
        password: '',
      };

      jest
        .spyOn(usersService, 'findOneByEmail')
        .mockRejectedValue(new NotFoundException());

      // Act
      const promise = authService.signin(payload);

      // Assert
      await expect(() => promise).rejects.toThrow(UnauthorizedException);
    });
  });
});
