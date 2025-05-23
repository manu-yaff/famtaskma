import { faker } from '@faker-js/faker/.';
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateShoppingItemDto } from 'src/modules/products/dto/create-shopping-item-input.dto';
import {
  ShoppingItem,
  ShoppingItemStatus,
} from 'src/modules/products/entities/shopping-item.entity';
import {
  getProductEntityMock,
  getProductsServiceMock,
} from 'src/modules/products/mocks/product.mock';
import {
  getCreateShoppingItemDtoMock,
  getShoppingItemEntityMock,
  getShoppingItemRepositoryMock,
} from 'src/modules/products/mocks/shopping-item.mock';
import {
  getShoppingListEntityMock,
  getShoppingListsServiceMock,
} from 'src/modules/products/mocks/shopping-list.mock';
import { ProductsService } from 'src/modules/products/services/products.service';
import { ShoppingItemsService } from 'src/modules/products/services/shopping-items.service';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { getUserEntityMock } from 'src/modules/users/mocks/user.mock';
import { getUsersServiceMock } from 'src/modules/users/mocks/users.service.mock';
import { UsersService } from 'src/modules/users/services/users.service';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

const SHOPPING_ITEM_REPOSITORY_TOKEN = getRepositoryToken(ShoppingItem);

describe(ShoppingItemsService.name, () => {
  let shoppingListItemsService: ShoppingItemsService;
  let usersService: UsersService;
  let productsService: ProductsService;
  let shoppingListsService: ShoppingListsService;
  let shoppingItemsRepository: MockType<Repository<ShoppingItem>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ShoppingItemsService,
        {
          provide: UsersService,
          useValue: getUsersServiceMock(),
        },
        {
          provide: ProductsService,
          useValue: getProductsServiceMock(),
        },
        {
          provide: ShoppingListsService,
          useValue: getShoppingListsServiceMock(),
        },
        {
          provide: SHOPPING_ITEM_REPOSITORY_TOKEN,
          useValue: getShoppingItemRepositoryMock(),
        },
      ],
    }).compile();

    shoppingListItemsService = moduleRef.get(ShoppingItemsService);
    usersService = moduleRef.get(UsersService);
    productsService = moduleRef.get(ProductsService);
    shoppingListsService = moduleRef.get(ShoppingListsService);
    shoppingItemsRepository = moduleRef.get(SHOPPING_ITEM_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(shoppingListItemsService).toBeDefined();
  });

  describe(ShoppingItemsService.prototype.create.name, () => {
    const dto: CreateShoppingItemDto = getCreateShoppingItemDtoMock();

    it('should return the created shopping item', async () => {
      // Arrange
      const shoppingListItemMock = getShoppingItemEntityMock();
      const userId = faker.string.uuid();

      jest
        .spyOn(shoppingItemsRepository, 'save')
        .mockResolvedValue(shoppingListItemMock);

      // Act
      const result = await shoppingListItemsService.create(dto, userId);

      // Assert
      expect(result).toEqual(shoppingListItemMock);
    });

    it(`should call ${ShoppingItem.name} ${Repository.prototype.save.name}`, async () => {
      // Arrange
      const dto: CreateShoppingItemDto = getCreateShoppingItemDtoMock();
      const userId = faker.string.uuid();

      const shoppingItemMock = getShoppingItemEntityMock({
        quantity: dto.quantity,
        quantityType: dto.quantityType,
        notes: dto.notes,
        location: dto.location,
        status: ShoppingItemStatus.Todo,
        shoppingList: getShoppingListEntityMock({ id: dto.shoppingListId }),
        product: getProductEntityMock({ id: dto.productId }),
        user: getUserEntityMock({ id: userId }),
      });

      jest
        .spyOn(shoppingItemsRepository, 'create')
        .mockReturnValue(shoppingItemMock);

      // Act
      await shoppingListItemsService.create(dto, userId);

      // Assert
      expect(shoppingItemsRepository.save).toHaveBeenCalledWith(
        shoppingItemMock,
      );
    });

    it(`should set initial status to todo ${ShoppingItemStatus.Todo}`, async () => {
      // Arrange
      const dto: CreateShoppingItemDto = getCreateShoppingItemDtoMock();
      const shoppingItemMock = getShoppingItemEntityMock();
      const userId = faker.string.uuid();

      jest
        .spyOn(shoppingItemsRepository, 'create')
        .mockReturnValue(shoppingItemMock);

      // Act
      await shoppingListItemsService.create(dto, userId);

      // Assert
      expect(shoppingItemsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: ShoppingItemStatus.Todo }),
      );
    });

    // TODO: get user from decorator
    it(`should throw ${NotFoundException.name} when user is not found`, async () => {
      // Arrange
      const dto: CreateShoppingItemDto = getCreateShoppingItemDtoMock();
      const userId = faker.string.uuid();

      const userNotFoundException = new NotFoundException();

      jest
        .spyOn(usersService, 'findOneByIdOrFail')
        .mockRejectedValue(userNotFoundException);

      // Act
      const promise = shoppingListItemsService.create(dto, userId);

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });

    it(`should throw ${NotFoundException.name} when product is not found`, async () => {
      // Arrange
      const dto: CreateShoppingItemDto = getCreateShoppingItemDtoMock();
      const userId = faker.string.uuid();

      const productNotFoundException = new NotFoundException();

      jest
        .spyOn(productsService, 'findOneByIdOrFail')
        .mockRejectedValue(productNotFoundException);

      // Act
      const promise = shoppingListItemsService.create(dto, userId);

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });

    it(`should throw ${NotFoundException.name} when list is not found`, async () => {
      // Arrange
      const dto: CreateShoppingItemDto = getCreateShoppingItemDtoMock();
      const userId = faker.string.uuid();

      const shoppingListNotFoundError = new NotFoundException();

      jest
        .spyOn(shoppingListsService, 'findOneByIdOrFail')
        .mockRejectedValue(shoppingListNotFoundError);

      // Act
      const promise = shoppingListItemsService.create(dto, userId);

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });
});
