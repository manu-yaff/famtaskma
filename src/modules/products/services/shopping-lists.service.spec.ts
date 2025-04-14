import { faker } from '@faker-js/faker/.';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { getShoppingListEntityMock } from 'src/modules/products/mocks/shopping-list.entity.mock';
import { getShoppingListsRepositoryMock } from 'src/modules/products/mocks/shopping-list.repository.mock';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { getUserEntityMock } from 'src/modules/users/mocks/user.entity.mock';
import { getUsersServiceMock } from 'src/modules/users/mocks/users.service.mock';
import { UsersService } from 'src/modules/users/users.service';
import { MockType } from 'src/shared/test/mock.type';
import { QueryFailedError, Repository } from 'typeorm';

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
        userId: faker.string.uuid(),
      };

      const shoppingListMock = getShoppingListEntityMock();
      const userMock = getUserEntityMock();

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockReturnValue(shoppingListMock);

      jest.spyOn(usersService, 'findOne').mockResolvedValue(userMock);

      // Act
      await shoppingListsService.create(payload);

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
        userId: faker.string.uuid(),
      };

      const shoppingListMock = getShoppingListEntityMock();

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockResolvedValue(shoppingListMock);

      // Act
      const result = await shoppingListsService.create(payload);

      // Assert
      expect(result).toBe(shoppingListMock);
    });

    it(`should throw when a ${QueryFailedError.name} occurs`, async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
        userId: faker.string.uuid(),
      };

      const databaseErrorMock = new Error('database error');

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockRejectedValue(databaseErrorMock);

      // Act
      const promise = shoppingListsService.create(payload);

      // Assert
      await expect(promise).rejects.toThrow(InternalServerErrorException);
    });

    it('should throw when user is not found', async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
        userId: faker.string.uuid(),
      };

      const userNotFoundExceptionMock = new NotFoundException();
      const shoppingListMock = getShoppingListEntityMock();

      jest
        .spyOn(usersService, 'findOne')
        .mockRejectedValue(userNotFoundExceptionMock);

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockResolvedValue(shoppingListMock);

      // Act
      const promise = shoppingListsService.create(payload);

      // Assert
      await expect(promise).rejects.toThrow(userNotFoundExceptionMock);
    });
  });
});
