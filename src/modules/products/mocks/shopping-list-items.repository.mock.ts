import { ShoppingListItem } from 'src/modules/products/entities/shopping-list-item.entity';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

export function getShoppingListItemsRepositoryMock(): MockType<
  Repository<ShoppingListItem>
> {
  return {
    save: jest.fn(),
  };
}
