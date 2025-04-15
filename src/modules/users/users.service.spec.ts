import { faker } from '@faker-js/faker/.';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { getCreateUserDto } from 'src/modules/users/mocks/create-user.input.mock';
import { getUserEntityMock } from 'src/modules/users/mocks/user.entity.mock';
import { getUserRepositoryMock } from 'src/modules/users/mocks/users.repository.mock';
import { UsersService } from 'src/modules/users/users.service';
import { MockType } from 'src/shared/test/mock.type';
import { EntityNotFoundError, Repository } from 'typeorm';

jest.mock('bcrypt');

const REPOSITORY_TOKEN = getRepositoryToken(User);

describe(UsersService.name, () => {
  let service: UsersService;
  let repository: MockType<Repository<User>>;

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
    it(`should throw ${InternalServerErrorException.name} when unknown error occurs`, async () => {
      // Arrange
      const createUserDto = getCreateUserDto();
      const errorMock = new Error('Unknown error');

      jest.spyOn(repository, 'save').mockRejectedValue(errorMock);

      // Act
      const promise = service.create(createUserDto);

      // Assert
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });

    it('should create user', async () => {
      // Arrange
      const createUserDto = getCreateUserDto();
      const newUserMock = getUserEntityMock();

      jest.spyOn(repository, 'save').mockResolvedValue(newUserMock);

      // Act
      const result = await service.create(createUserDto);

      // Assert
      expect(result).toEqual(newUserMock);
      expect(repository.save).toHaveBeenCalledWith({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      });
    });
  });

  describe(UsersService.prototype.findOneByEmailOrFail.name, () => {
    it('should find user by email', async () => {
      // Arrange
      const emailMock = faker.internet.email();

      // Act
      await service.findOneByEmailOrFail(emailMock);

      // Assert
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({
        email: emailMock,
      });
    });

    it('should throw if user is not found', async () => {
      // Arrange
      const emailMock = faker.internet.email();
      const notFoundError = new EntityNotFoundError(User, { email: emailMock });

      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockRejectedValue(notFoundError);

      // Act
      const promise = service.findOneByEmailOrFail(emailMock);

      // Assert
      await expect(promise).rejects.toThrow();
    });
  });

  describe(UsersService.prototype.findOneByIdOrFail.name, () => {
    it('should find user by id', async () => {
      // Arrange
      const idMock = faker.string.uuid();

      // Act
      await service.findOneByIdOrFail(idMock);

      // Assert
      expect(repository.findOneByOrFail).toHaveBeenCalledWith({
        id: idMock,
      });
    });

    it('should throw if user is not found', async () => {
      // Arrange
      const idMock = faker.string.uuid();
      const notFoundError = new EntityNotFoundError(User, { id: idMock });

      jest
        .spyOn(repository, 'findOneByOrFail')
        .mockRejectedValue(notFoundError);

      // Act
      const promise = service.findOneByEmailOrFail(idMock);

      // Assert
      await expect(promise).rejects.toThrow();
    });
  });
});
