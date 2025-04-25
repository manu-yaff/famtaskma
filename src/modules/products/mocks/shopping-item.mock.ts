import { faker } from '@faker-js/faker/.';
import { CreateShoppingItemDto } from 'src/modules/products/dto/create-shopping-item-input.dto';
import {
  QuantityType,
  ShoppingItem,
  ShoppingItemStatus,
} from 'src/modules/products/entities/shopping-item.entity';
import { getProductMock } from 'src/modules/products/mocks/product.entity.mock';
import { getShoppingListEntityMock } from 'src/modules/products/mocks/shopping-list.entity.mock';
import { getUserEntityMock } from 'src/modules/users/mocks/user.entity.mock';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

export function getShoppingItemEntityMock(): ShoppingItem {
  return {
    id: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 100 }),
    quantityType: faker.helpers.enumValue(QuantityType),
    notes: faker.word.words(),
    location: faker.location.direction(),
    shoppingList: getShoppingListEntityMock(),
    product: getProductMock(),
    user: getUserEntityMock(),
    status: ShoppingItemStatus.Todo,
  };
}

export function getCreateShoppingItemDtoMock(): CreateShoppingItemDto {
  return {
    quantity: faker.number.int({ min: 1, max: 100 }),
    quantityType: faker.helpers.enumValue(QuantityType),
    notes: faker.word.words(),
    location: faker.location.direction(),
    shoppingListId: faker.string.uuid(),
    productId: faker.string.uuid(),
    userId: faker.string.uuid(),
  };
}

export function getShoppingItemRepositoryMock(): MockType<
  Repository<ShoppingItem>
> {
  return {
    save: jest.fn(),
  };
}
