import { Category } from 'src/modules/products/entities/category.entity';
import { MockType } from 'src/modules/products/mocks/mock.type';
import { Repository } from 'typeorm';

export function getCategoriesRepositoryMock(): MockType<
  jest.Mocked<Repository<Category>>
> {
  return {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
}
