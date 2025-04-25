import { UsersService } from 'src/modules/users/services/users.service';
import { MockType } from 'src/shared/test/mock.type';

export function getUsersServiceMock(): MockType<UsersService> {
  return {
    create: jest.fn(),
    findOneByEmailOrFail: jest.fn(),
    findOneByIdOrFail: jest.fn(),
  };
}
