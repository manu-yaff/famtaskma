import { faker } from '@faker-js/faker';
import { Category } from 'src/modules/products/entities/category.entity';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

export function getCategoriesRepositoryMock(): MockType<Repository<Category>> {
  return {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
}

export function getCategoryEntityMock(overrides?: Partial<Category>): Category {
  return {
    id: faker.string.uuid(),
    name: 'Fruits',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
