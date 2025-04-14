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
