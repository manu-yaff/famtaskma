import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateShoppingListItemDto } from 'src/modules/products/dto/create-shopping-list-item-input.dto';
import {
  ShoppingItemStatus,
  ShoppingListItem,
} from 'src/modules/products/entities/shopping-list-item.entity';
import { getProductsServiceMock } from 'src/modules/products/mocks/products.service.mock';
import {
  getCreateShoppingListItemDtoMock,
  getShoppingListItemEntityMock,
} from 'src/modules/products/mocks/shopping-list-item.entity.mock';
import { getShoppingListItemsRepositoryMock } from 'src/modules/products/mocks/shopping-list-items.repository.mock';
import { getShoppingListsServiceMock } from 'src/modules/products/mocks/shopping-lists.service.mock';
import { ProductsService } from 'src/modules/products/services/products.service';
import { ShoppingListItemsService } from 'src/modules/products/services/shopping-list-items.service';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { getUsersServiceMock } from 'src/modules/users/mocks/users.service.mock';
import { UsersService } from 'src/modules/users/users.service';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

const SHOPPING_LIST_ITEM_REPOSITORY_TOKEN =
  getRepositoryToken(ShoppingListItem);

describe(ShoppingListItemsService.name, () => {
  let shoppingListItemsService: ShoppingListItemsService;
  let usersService: UsersService;
  let productsService: ProductsService;
  let shoppingListsService: ShoppingListsService;
  let shoppingListItemsRepository: MockType<Repository<ShoppingListItem>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ShoppingListItemsService,
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
          provide: SHOPPING_LIST_ITEM_REPOSITORY_TOKEN,
          useValue: getShoppingListItemsRepositoryMock(),
        },
      ],
    }).compile();

    shoppingListItemsService = moduleRef.get(ShoppingListItemsService);
    usersService = moduleRef.get(UsersService);
    productsService = moduleRef.get(ProductsService);
    shoppingListsService = moduleRef.get(ShoppingListsService);
    shoppingListItemsRepository = moduleRef.get(
      SHOPPING_LIST_ITEM_REPOSITORY_TOKEN,
    );
  });

  it('should be defined', () => {
    expect(shoppingListItemsService).toBeDefined();
  });

  describe(ShoppingListItemsService.prototype.create.name, () => {
    const dto: CreateShoppingListItemDto = getCreateShoppingListItemDtoMock();

    it('should return create shopping list item', async () => {
      // Arrange
      const shoppingListItemMock = getShoppingListItemEntityMock();

      jest
        .spyOn(shoppingListItemsRepository, 'save')
        .mockResolvedValue(shoppingListItemMock);

      // Act
      const result = await shoppingListItemsService.create(dto);

      // Assert
      expect(result).toEqual(shoppingListItemMock);
    });

    it(`should call ${ShoppingListItem.name} ${Repository.prototype.save.name}`, async () => {
      // Arrange
      const dto: CreateShoppingListItemDto = getCreateShoppingListItemDtoMock();

      // Act
      await shoppingListItemsService.create(dto);

      // Assert
      expect(shoppingListItemsRepository.save).toHaveBeenCalledWith({
        quantity: dto.quantity,
        quantityType: dto.quantityType,
        notes: dto.notes,
        location: dto.location,
        status: ShoppingItemStatus.Todo,
        shoppingListId: dto.shoppingListId,
        productId: dto.productId,
        userId: dto.userId,
      });
    });

    it('should set initial status to todo', async () => {
      // Arrange
      const dto: CreateShoppingListItemDto = getCreateShoppingListItemDtoMock();

      // Act
      await shoppingListItemsService.create(dto);

      // Assert
      expect(shoppingListItemsRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: ShoppingItemStatus.Todo }),
      );
    });

    // TODO: get user from decorator
    it(`should throw ${NotFoundException.name} when user is not found`, async () => {
      // Arrange
      const dto: CreateShoppingListItemDto = getCreateShoppingListItemDtoMock();

      const userNotFoundException = new NotFoundException();

      jest
        .spyOn(usersService, 'findOneByIdOrFail')
        .mockRejectedValue(userNotFoundException);

      // Act
      const promise = shoppingListItemsService.create(dto);

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });

    it(`should throw ${NotFoundException.name} when product is not found`, async () => {
      // Arrange
      const dto: CreateShoppingListItemDto = getCreateShoppingListItemDtoMock();

      const productNotFoundException = new NotFoundException();

      jest
        .spyOn(productsService, 'findOneByIdOrFail')
        .mockRejectedValue(productNotFoundException);

      // Act
      const promise = shoppingListItemsService.create(dto);

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });

    it(`should throw ${NotFoundException.name} when list is not found`, async () => {
      // Arrange
      const dto: CreateShoppingListItemDto = getCreateShoppingListItemDtoMock();

      const shoppingListNotFoundError = new NotFoundException();

      jest
        .spyOn(shoppingListsService, 'findOneByIdOrFail')
        .mockRejectedValue(shoppingListNotFoundError);

      // Act
      const promise = shoppingListItemsService.create(dto);

      // Assert
      await expect(promise).rejects.toThrow(NotFoundException);
    });
  });
});
