import { faker } from '@faker-js/faker';
import { Category } from 'src/modules/products/entities/category.entity';

export function getCategoryMock(overrides?: Partial<Category>): Category {
  return {
    id: faker.string.uuid(),
    name: 'Fruits',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}
