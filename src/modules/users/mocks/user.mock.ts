import { faker } from '@faker-js/faker/.';
import { SigninInputDto } from 'src/modules/auth/dto/signin-input.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';
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

export function getCreateUserDto(
  overrides?: Partial<CreateUserDto>,
): CreateUserDto {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    ...overrides,
  };
}

export function getSiginDto(): SigninInputDto {
  return {
    email: faker.internet.email(),
    password: faker.internet.password(),
  };
}
