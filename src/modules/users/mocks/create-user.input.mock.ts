import { CreateUserDto } from 'src/modules/users/dto/create-user.input';

export function getCreateUserDto(
  overrides?: Partial<CreateUserDto>,
): CreateUserDto {
  return {
    name: 'jonh',
    email: 'jonh@gmail.com',
    password: 'secret-password',
    ...overrides,
  };
}
