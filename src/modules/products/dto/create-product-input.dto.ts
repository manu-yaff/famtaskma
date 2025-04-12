import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateProductDto {
  /**
   * Product name
   * @example Banana
   */
  @IsNotEmpty()
  name: string;

  /**
   * Product name
   * @example Banana
   */
  @IsNotEmpty()
  description: string;

  /**
   * Product name
   * @example Banana
   */
  @IsUUID()
  categoryId: string;
}
