import { PickType } from '@nestjs/swagger';
import { ShoppingItem } from 'src/modules/products/entities/shopping-item.entity';

export class CreateShoppingItemDto extends PickType(ShoppingItem, [
  'quantity',
  'quantityType',
  'location',
  'notes',
]) {
  /**
   * User id
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  userId: string;

  /**
   * Product id
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  productId: string;

  /**
   * Shopping list id
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  shoppingListId: string;
}
