import { faker } from '@faker-js/faker/.';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { Repository } from 'typeorm';

import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { MockType } from 'src/shared/test/mock.type';

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

export function getCreateShoppingListDtoMock(): CreateShoppingListDto {
  return {
    name: 'Shoping at ' + faker.location.direction(),
  };
}

export function getShoppingListsRepositoryMock(): MockType<
  Repository<ShoppingList>
> {
  return {
    save: jest.fn(),
    create: jest.fn(),
    findBy: jest.fn(),
  };
}

export function getShoppingListsServiceMock(): MockType<ShoppingListsService> {
  return {
    create: jest.fn(),
    findOneByIdOrFail: jest.fn(),
  };
}
