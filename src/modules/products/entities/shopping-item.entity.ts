import { Product } from 'src/modules/products/entities/product.entity';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum QuantityType {
  Grams = 'grams',
  Unit = 'unit',
}

export enum ShoppingItemStatus {
  Todo = 'todo',
  InProgress = 'in_progress',
  Completed = 'completed',
}

@Entity()
export class ShoppingItem {
  /**
   * Shopping item id
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Shopping item quantity
   * @example 300
   */
  @Column({ nullable: false })
  quantity: number;

  /**
   * Shopping item quantity type
   * @example grams
   */
  @Column({
    nullable: false,
    name: 'quantity_type',
    type: 'enum',
    enum: QuantityType,
  })
  quantityType: QuantityType;

  /**
   * Shopping item notes
   * @example "Buy light milk"
   */
  @Column({ nullable: true })
  notes?: string;

  /**
   * Shopping item location
   * @example Chedraui
   */
  @Column({ nullable: false })
  location: string;

  /**
   * Shopping item status
   * @example completed
   */
  @Column({ nullable: false, type: 'enum', enum: ShoppingItemStatus })
  status: ShoppingItemStatus;

  /**
   * Shopping list id to where this item belongs to
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  @ManyToOne(() => ShoppingList, { nullable: false })
  @JoinColumn({ name: 'shopping_list_id' })
  shoppingList: ShoppingList;

  /**
   * Id of the product for this item
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  @ManyToOne(() => Product, { nullable: false })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  /**
   * User id who added the item to the list
   * @example 01080f05-2900-40d7-9627-e7085a26a247
   */
  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
