import { QuantityType } from 'src/modules/products/entities/shopping-list-item.entity';

export class CreateShoppingListItemDto {
  /**
   *
   */
  quantity: number;

  /**
   *
   */
  quantityType: QuantityType;

  /**
   *
   */
  notes: string;

  /**
   *
   */
  location: string;

  /**
   *
   */
  shoppingListId: string;

  /**
   *
   */
  productId: string;

  /**
   *
   */
  userId: string;
}
