import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  /**
   * User name
   * @example jonh doe
   */
  @IsNotEmpty()
  name: string;

  /**
   * User email
   * @example jonh@gmail.com
   */
  @IsEmail()
  email: string;

  /**
   * User password
   * @example secret-password
   */
  @IsNotEmpty()
  password: string;
}
