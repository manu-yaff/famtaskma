import { UsersService } from 'src/modules/users/users.service';

export function getUsersServiceMock(): jest.Mocked<Partial<UsersService>> {
  return {
    create: jest.fn(),
    findOneByEmail: jest.fn(),
  };
}
