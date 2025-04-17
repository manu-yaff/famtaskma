import { Entity } from 'typeorm';

export enum QuantityType {
  Grams,
  Unit,
}

export enum ShoppingItemStatus {
  Todo,
  InProgress,
  Completed,
}

@Entity()
export class ShoppingListItem {
  /**
   *
   */
  id: string;

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
  status: ShoppingItemStatus;

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
