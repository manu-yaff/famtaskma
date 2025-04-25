import { faker } from '@faker-js/faker/.';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';

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
