import { Product } from 'src/modules/products/entities/product.entity';
import { MockType } from 'src/modules/products/mocks/mock.type';
import { Repository } from 'typeorm';

export function getProductsRepositoryMock(): MockType<Repository<Product>> {
  return {
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
}
