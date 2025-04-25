import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from 'src/modules/products/controllers/categories.controller';
import { ProductsController } from 'src/modules/products/controllers/products.controller';
import { ShoppingItemController } from 'src/modules/products/controllers/shopping-item.controller';
import { ShoppingListsController } from 'src/modules/products/controllers/shopping-lists.controller';
import { Category } from 'src/modules/products/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ShoppingItem } from 'src/modules/products/entities/shopping-item.entity';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { CategoriesService } from 'src/modules/products/services/categories.service';
import { ProductsService } from 'src/modules/products/services/products.service';
import { ShoppingItemsService } from 'src/modules/products/services/shopping-items.service';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([Category, Product, ShoppingList, ShoppingItem]),
  ],
  providers: [
    CategoriesService,
    ProductsService,
    ShoppingListsService,
    ShoppingItemsService,
  ],
  controllers: [
    CategoriesController,
    ProductsController,
    ShoppingListsController,
    ShoppingItemController,
  ],
})
export class ProductsModule {}
