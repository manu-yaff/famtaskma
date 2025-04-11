import { Category } from 'src/modules/products/entities/category.entity';
import { Repository } from 'typeorm';

export type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

export function getCategoriesRepositoryMock(): MockType<
  jest.Mocked<Repository<Category>>
> {
  return {
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
}
