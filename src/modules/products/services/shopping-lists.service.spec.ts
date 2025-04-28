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
        userId: faker.string.uuid(),
      };

      const shoppingListMock = getShoppingListEntityMock();
      const userMock = getUserEntityMock();

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockReturnValue(shoppingListMock);

      jest.spyOn(usersService, 'findOneByIdOrFail').mockResolvedValue(userMock);

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

    it(`should throw ${InternalServerErrorException.name} when unknown error occurs`, async () => {
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

    it(`should throw ${NotFoundException.name} when given user id is not found`, async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
        userId: faker.string.uuid(),
      };

      const userNotFoundExceptionMock = new EntityNotFoundError(User, {
        id: payload.userId,
      });

      const shoppingListMock = getShoppingListEntityMock();

      jest
        .spyOn(usersService, 'findOneByIdOrFail')
        .mockRejectedValue(userNotFoundExceptionMock);

      jest
        .spyOn(shoppingListsRepository, 'save')
        .mockResolvedValue(shoppingListMock);

      // Act
      const promise = shoppingListsService.create(payload);

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
});
