import { Category } from 'src/modules/products/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  /**
   * Product id
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Product name
   * @example Melon
   */
  @Column()
  name: string;

  /**
   * Product description
   * @example "Green Melon"
   */
  @Column()
  description: string;

  /**
   * Product creation time
   * @example 2025-04-12T19:26:10.144Z
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * Product update time
   * @example 2025-04-12T19:26:10.144Z
   */
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
