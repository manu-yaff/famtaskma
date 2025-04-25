import { faker } from '@faker-js/faker/.';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';

export function getShoppingListEntityMock(
  overrides?: Partial<ShoppingList>,
): ShoppingList {
  return {
    id: faker.string.uuid(),
    name: faker.location.street(),
    createdAt: faker.date.soon(),
    updatedAt: faker.date.soon(),
    users: [],
    ...overrides,
  };
}
