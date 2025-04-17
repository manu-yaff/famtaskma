import { ProductsService } from 'src/modules/products/services/products.service';
import { MockType } from 'src/shared/test/mock.type';

export function getProductsServiceMock(): MockType<ProductsService> {
  return {
    findAll: jest.fn(),
    create: jest.fn(),
    findOneByIdOrFail: jest.fn(),
  };
}
