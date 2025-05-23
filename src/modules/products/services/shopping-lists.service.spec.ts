import { faker } from '@faker-js/faker/.';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import {
  getShoppingListEntityMock,
  getShoppingListsRepositoryMock,
} from 'src/modules/products/mocks/shopping-list.mock';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { User } from 'src/modules/users/entities/user.entity';
import { getUserEntityMock } from 'src/modules/users/mocks/user.mock';
import { getUsersServiceMock } from 'src/modules/users/mocks/users.service.mock';
import { UsersService } from 'src/modules/users/services/users.service';
import { MockType } from 'src/shared/test/mock.type';
import { EntityNotFoundError, Repository } from 'typeorm';

const SHOPPING_LISTS_REPOSITORY_TOKEN = getRepositoryToken(ShoppingList);

describe(ShoppingListsService.name, () => {
  let shoppingListsService: ShoppingListsService;
  let shoppingListsRepository: MockType<Repository<ShoppingList>>;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ShoppingListsService,
        {
          provide: SHOPPING_LISTS_REPOSITORY_TOKEN,
          useValue: getShoppingListsRepositoryMock(),
        },
        {
          provide: UsersService,
          useValue: getUsersServiceMock(),
        },
      ],
    }).compile();

    shoppingListsService = moduleRef.get(ShoppingListsService);
    shoppingListsRepository = moduleRef.get(SHOPPING_LISTS_REPOSITORY_TOKEN);
    usersService = moduleRef.get(UsersService);
  });

  describe(ShoppingListsService.prototype.create.name, () => {
    it('should save shopping list for the given user', async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
      };

      const userId = faker.string.uuid();

      const shoppingListMock = getShoppingListEntityMock();
      const userMock = getUserEntityMock();

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockReturnValue(shoppingListMock);

      jest.spyOn(usersService, 'findOneByIdOrFail').mockResolvedValue(userMock);

      // Act
      await shoppingListsService.create(payload, userId);

      // Assert
      expect(shoppingListsRepository.save).toHaveBeenCalledWith({
        name: payload.name,
        users: [userMock],
      });
    });

    it('should return the created shopping list', async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
      };

      const userId = faker.string.uuid();

      const shoppingListMock = getShoppingListEntityMock();

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockResolvedValue(shoppingListMock);

      // Act
      const result = await shoppingListsService.create(payload, userId);

      // Assert
      expect(result).toBe(shoppingListMock);
    });

    it(`should throw ${InternalServerErrorException.name} when unknown error occurs`, async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
      };

      const userId = faker.string.uuid();

      const databaseErrorMock = new Error('database error');

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockRejectedValue(databaseErrorMock);

      // Act
      const promise = shoppingListsService.create(payload, userId);

      // Assert
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });

    it(`should throw ${NotFoundException.name} when given user id is not found`, async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
      };

      const userId = faker.string.uuid();

      const userNotFoundExceptionMock = new EntityNotFoundError(User, {
        id: userId,
      });

      const shoppingListMock = getShoppingListEntityMock();

      jest
        .spyOn(usersService, 'findOneByIdOrFail')
        .mockRejectedValue(userNotFoundExceptionMock);

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockResolvedValue(shoppingListMock);

      // Act
      const promise = shoppingListsService.create(payload, userId);

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });

  describe(ShoppingListsService.prototype.findAllByUserEmail.name, () => {
    it('should get all lists for the given email', async () => {
      // Arrange
      const userEmailMock = faker.internet.email();

      // Act
      await shoppingListsService.findAllByUserEmail(userEmailMock);

      // Assert
      expect(shoppingListsRepository.findBy).toHaveBeenCalledWith({
        users: { email: userEmailMock },
      });
    });

    it(`should throw ${InternalServerErrorException.name} if error ocurrs`, async () => {
      // Arrange
      const userEmailMock = faker.internet.email();
      const errorMock = new Error('unexpected error');

      jest
        .spyOn(shoppingListsRepository, 'findBy')
        .mockRejectedValue(errorMock);

      // Act
      const promise = shoppingListsService.findAllByUserEmail(userEmailMock);

      // Assert
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe(ShoppingListsService.prototype.findOneByIdAndUser.name, () => {
    it(`should throw ${NotFoundException.name} when shopping list id does not exist`, async () => {
      // Arrange
      const mockListId = faker.string.uuid();
      const mockUserId = faker.string.uuid();

      jest
        .spyOn(shoppingListsRepository, 'findOne')
        .mockRejectedValue(
          new EntityNotFoundError(ShoppingList, { id: mockListId }),
        );

      // Act
      const promise = shoppingListsService.findOneByIdAndUser(
        mockListId,
        mockUserId,
      );

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });

    it('should return the shopping list along with the items', async () => {
      // Arrange
      const mockListId = faker.string.uuid();
      const mockUserId = faker.string.uuid();

      jest.spyOn(shoppingListsRepository, 'findOne');

      // Act
      await shoppingListsService.findOneByIdAndUser(mockListId, mockUserId);

      // Assert
      expect(shoppingListsRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: mockListId,
          users: { id: mockUserId },
        },
        relations: ['items'],
      });
    });
  });
});
