import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/modules/users/entities/user.entity';
import { getCreateUserDto } from 'src/modules/users/mocks/create-user.input.mock';
import { getUserRepositoryMock } from 'src/modules/users/mocks/users.repository.mock';
import {
  EmailAlreadyInUseError,
  UsersService,
  UserUnexpectedError,
} from 'src/modules/users/users.service';
import { QueryFailedError, Repository } from 'typeorm';

jest.mock('bcrypt');

const REPOSITORY_TOKEN = getRepositoryToken(User);

describe(UsersService.name, () => {
  let service: UsersService;
  let repository: Partial<jest.Mocked<Repository<User>>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: REPOSITORY_TOKEN,
          useValue: getUserRepositoryMock(),
        },
      ],
    }).compile();

    service = moduleRef.get(UsersService);
    repository = moduleRef.get(REPOSITORY_TOKEN);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(UsersService.prototype.create.name, () => {
    it(`should throw ${EmailAlreadyInUseError.name} when email has already been used`, async () => {
      // Arrange
      const createUserDto = getCreateUserDto();
      const driverError = new Error(
        'duplicate key value violates unique constraint',
      ) as Error & { code: string };

      driverError.code = '23505';

      jest
        .spyOn(repository, 'save')
        .mockRejectedValue(new QueryFailedError('', [], driverError));

      // Act
      const promise = service.create(createUserDto);

      // Assert
      await expect(promise).rejects.toThrow(EmailAlreadyInUseError);
    });

    it(`should throw ${UserUnexpectedError.name} when unknown error ocurrs`, async () => {
      // Arrange
      const createUserDto = getCreateUserDto();
      const errorMock = new Error('Unknown error');

      jest.spyOn(repository, 'save').mockRejectedValue(errorMock);

      // Act
      const promise = service.create(createUserDto);

      // Assert
      await expect(promise).rejects.toThrow(UserUnexpectedError);
    });

    it('should create user', async () => {
      // Arrange
      const createUserDto = getCreateUserDto();
      const hashedPasswordMock = '$hash$password$$$';
      const newUserMock: User = {
        id: '10',
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPasswordMock,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const hashMock = (
        jest.spyOn(bcrypt, 'hash') as jest.Mock
      ).mockResolvedValue(hashedPasswordMock);

      jest.spyOn(repository, 'save').mockResolvedValue(newUserMock);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(newUserMock);
      expect(repository.create).toHaveBeenCalledWith({
        name: newUserMock.name,
        email: newUserMock.email,
        password: hashedPasswordMock,
      });
      expect(hashMock).toHaveBeenCalledTimes(1);
    });
  });
});
