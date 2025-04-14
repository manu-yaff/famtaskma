import { User } from 'src/modules/users/entities/user.entity';

export function getUserEntityMock(overrides?: Partial<User>): User {
  return {
    id: '',
    name: 'jonh',
    email: 'jonh@gmail.com',
    password: '',
    createdAt: new Date(),
    updatedAt: new Date(),
    shoppingLists: [],
    ...overrides,
  };
}
