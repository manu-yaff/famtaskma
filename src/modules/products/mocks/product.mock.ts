import { faker } from '@faker-js/faker/.';
import { Product } from 'src/modules/products/entities/product.entity';
import { getCategoryEntityMock } from 'src/modules/products/mocks/category.mock';
import { ProductsService } from 'src/modules/products/services/products.service';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

export function getProductEntityMock(overrides?: Partial<Product>): Product {
  return {
    id: faker.string.uuid(),
    name: faker.food.fruit(),
    description: faker.food.description(),
    createdAt: new Date(),
    updatedAt: new Date(),
    category: getCategoryEntityMock(),
    ...overrides,
  };
}

export function getProductsRepositoryMock(): MockType<Repository<Product>> {
  return {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
}

export function getProductsServiceMock(): MockType<ProductsService> {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    findOneByIdOrFail: jest.fn(),
  };
}
