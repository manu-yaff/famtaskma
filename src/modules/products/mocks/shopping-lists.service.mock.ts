import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { MockType } from 'src/shared/test/mock.type';

export function getShoppingListsServiceMock(): MockType<ShoppingListsService> {
  return {
    create: jest.fn(),
    findOneByIdOrFail: jest.fn(),
  };
}
