import { faker } from '@faker-js/faker/.';
import { User } from 'src/modules/users/entities/user.entity';

export function getUserEntityMock(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    createdAt: faker.date.soon(),
    updatedAt: faker.date.soon(),
    shoppingLists: [],
    ...overrides,
  };
}
