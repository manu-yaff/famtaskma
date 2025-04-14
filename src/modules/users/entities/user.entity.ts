import { Exclude } from 'class-transformer';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  /**
   * User id
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * User name
   * @example "Jonh Doe"
   */
  @Column({ length: 100, nullable: false })
  name: string;

  /**
   * User email
   * @example jonh@gmail.com
   */
  @Column({ length: 100, nullable: false, unique: true })
  email: string;

  /**
   * User password
   * @example secret-password
   */
  @Exclude()
  @Column({ nullable: false })
  password: string;

  /**
   * User creation time
   * @example 2025-04-12T19:26:10.144Z
   */
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  /**
   * User update time
   * @example 2025-04-12T19:26:10.144Z
   */
  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;

  @ManyToMany(() => ShoppingList)
  shoppingLists: ShoppingList[];
}
