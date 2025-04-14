import { UsersService } from 'src/modules/users/users.service';
import { MockType } from 'src/shared/test/mock.type';

export function getUsersServiceMock(): MockType<UsersService> {
  return {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
    findOne: jest.fn(),
  };
}
