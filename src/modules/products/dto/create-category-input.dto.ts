import { IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  /**
   * Category name
   * @example Vegetables
   */
  @IsNotEmpty()
  name: string;
}
