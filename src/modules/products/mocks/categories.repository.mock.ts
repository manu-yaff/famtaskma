import { Category } from 'src/modules/products/entities/category.entity';
import { Repository } from 'typeorm';

export function getCategoriesRepositoryMock(): Partial<Repository<Category>> {
  return {
    find: jest.fn(),
  };
}
