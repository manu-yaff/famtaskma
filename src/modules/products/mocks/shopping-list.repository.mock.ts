import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

export function getShoppingListsRepositoryMock(): MockType<
  Repository<ShoppingList>
> {
  return {
    save: jest.fn(),
    create: jest.fn(),
  };
}
