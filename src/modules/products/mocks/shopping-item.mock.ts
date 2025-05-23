import { faker } from '@faker-js/faker/.';
import { CreateShoppingItemDto } from 'src/modules/products/dto/create-shopping-item-input.dto';
import {
  QuantityType,
  ShoppingItem,
  ShoppingItemStatus,
} from 'src/modules/products/entities/shopping-item.entity';
import { getProductEntityMock } from 'src/modules/products/mocks/product.mock';
import { getShoppingListEntityMock } from 'src/modules/products/mocks/shopping-list.mock';
import { getUserEntityMock } from 'src/modules/users/mocks/user.mock';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

export function getShoppingItemEntityMock(
  overrides?: Partial<ShoppingItem>,
): ShoppingItem {
  return {
    id: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 100 }),
    quantityType: faker.helpers.enumValue(QuantityType),
    notes: faker.word.words(),
    location: faker.location.direction(),
    shoppingList: getShoppingListEntityMock(),
    product: getProductEntityMock(),
    user: getUserEntityMock(),
    status: ShoppingItemStatus.Todo,
    ...overrides,
  };
}

export function getCreateShoppingItemDtoMock(
  overrides?: Partial<CreateShoppingItemDto>,
): CreateShoppingItemDto {
  return {
    quantity: faker.number.int({ min: 1, max: 100 }),
    quantityType: faker.helpers.enumValue(QuantityType),
    notes: faker.word.words(),
    location: faker.location.direction(),
    shoppingListId: faker.string.uuid(),
    productId: faker.string.uuid(),
    ...overrides,
  };
}

export function getShoppingItemRepositoryMock(): MockType<
  Repository<ShoppingItem>
> {
  return {
    save: jest.fn(),
    create: jest.fn(),
  };
}
