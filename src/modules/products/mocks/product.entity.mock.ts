import { faker } from '@faker-js/faker/.';
import { Product } from 'src/modules/products/entities/product.entity';
import { getCategoryMock } from 'src/modules/products/mocks/category.entity.mock';

export function getProductMock(overrides?: Partial<Product>): Product {
  return {
    id: faker.string.uuid(),
    name: faker.food.fruit(),
    description: faker.food.description(),
    createdAt: new Date(),
    updatedAt: new Date(),
    category: getCategoryMock(),
    ...overrides,
  };
}
