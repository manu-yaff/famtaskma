import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateShoppingListDto {
  /**
   * Shopping list name
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @IsNotEmpty()
  name: string;

  /**
   * User id
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @IsUUID()
  userId: string;
}
