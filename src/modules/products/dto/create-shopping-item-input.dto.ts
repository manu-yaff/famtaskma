import { PickType } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { ShoppingItem } from 'src/modules/products/entities/shopping-item.entity';

export class CreateShoppingItemDto extends PickType(ShoppingItem, [
  'quantity',
  'quantityType',
  'location',
  'notes',
]) {
  /**
   * Product id
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  @IsUUID()
  productId: string;

  /**
   * Shopping list id
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  @IsUUID()
  shoppingListId: string;
}
