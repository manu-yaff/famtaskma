import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from 'src/modules/products/controllers/categories.controller';
import { ProductsController } from 'src/modules/products/controllers/products.controller';
import { ShoppingListsController } from 'src/modules/products/controllers/shopping-lists.controller';
import { Category } from 'src/modules/products/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { CategoriesService } from 'src/modules/products/services/categories.service';
import { ProductsService } from 'src/modules/products/services/products.service';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Category, Product, ShoppingList]),
  ],
  controllers: [
    CategoriesController,
    ProductsController,
    ShoppingListsController,
  ],
  providers: [CategoriesService, ProductsService, ShoppingListsService],
})
export class ProductsModule {}
