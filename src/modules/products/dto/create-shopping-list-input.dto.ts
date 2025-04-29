import { IsNotEmpty } from 'class-validator';

export class CreateShoppingListDto {
  /**
   * Shopping list name
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @IsNotEmpty()
  name: string;
}
