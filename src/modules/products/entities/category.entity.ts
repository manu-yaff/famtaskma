import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Category {
  /**
   * Category id
   * @example 5f33cf88-9f3e-4802-85a8-4d652969bde7
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * Category name
   * @example Fruits
   */
  @Column({ nullable: false, unique: true })
  name: string;

  /**
   * Category update time
   * @example 2025-04-12T19:26:10.144Z
   */
  @CreateDateColumn({ nullable: false })
  createdAt: Date;

  /**
   * Category update time
   * @example 2025-04-12T19:26:10.144Z
   */
  @UpdateDateColumn({ nullable: false })
  updatedAt: Date;
}
