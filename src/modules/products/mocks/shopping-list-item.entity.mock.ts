import { faker } from '@faker-js/faker/.';
import { CreateShoppingListItemDto } from 'src/modules/products/dto/create-shopping-list-item-input.dto';
import {
  QuantityType,
  ShoppingItemStatus,
  ShoppingListItem,
} from 'src/modules/products/entities/shopping-list-item.entity';

export function getShoppingListItemEntityMock(): ShoppingListItem {
  return {
    id: faker.string.uuid(),
    quantity: faker.number.int({ min: 1, max: 100 }),
    quantityType: faker.helpers.enumValue(QuantityType),
    notes: faker.word.words(),
    location: faker.location.direction(),
    shoppingListId: faker.string.uuid(),
    productId: faker.string.uuid(),
    userId: faker.string.uuid(),
    status: ShoppingItemStatus.Todo,
  };
}

export function getCreateShoppingListItemDtoMock(): CreateShoppingListItemDto {
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
