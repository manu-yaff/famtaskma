import { User } from 'src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

export function getUserRepositoryMock(): Partial<
  jest.Mocked<Repository<User>>
> {
  return {
    create: jest.fn(),
    save: jest.fn(),
  };
}
