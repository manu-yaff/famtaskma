import { IsEmail, IsNotEmpty } from 'class-validator';

export class SigninInputDto {
  /**
   * User email
   * @example jonh@gmail.com
   */
  @IsEmail()
  email: string;

  /**
   * User password
   * @example secret
   */
  @IsNotEmpty()
  password: string;
}
