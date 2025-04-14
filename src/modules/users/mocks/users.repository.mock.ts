import { User } from 'src/modules/users/entities/user.entity';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

export function getUserRepositoryMock(): MockType<Repository<User>> {
  return {
    create: jest.fn(),
    save: jest.fn(),
  };
}
