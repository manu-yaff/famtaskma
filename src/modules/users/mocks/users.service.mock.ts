import { UsersService } from 'src/modules/users/users.service';

export function getUsersServiceMock(): Partial<jest.Mocked<UsersService>> {
  return {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
  };
}
