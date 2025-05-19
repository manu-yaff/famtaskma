import { ShoppingItem } from 'src/modules/products/entities/shopping-item.entity';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ShoppingList {
  /**
   * Shopping list id
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Shopping list name
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @Column()
  name: string;

  /**
   * Shopping list creation time
   * @example 2025-04-12T19:26:10.144Z
   */
  @CreateDateColumn({ nullable: false, name: 'created_at' })
  createdAt: Date;

  /**
   * Shopping list update time
   * @example 2025-04-12T19:26:10.144Z
   */
  @UpdateDateColumn({ nullable: false, name: 'updated_at' })
  updatedAt: Date;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'shoping_lists_users',
    joinColumn: {
      name: 'shopping_list_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  users: User[];

  @OneToMany(() => ShoppingItem, (item) => item.shoppingList)
  items: ShoppingItem[];
}
