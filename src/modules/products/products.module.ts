import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from 'src/modules/products/controllers/categories.controller';
import { ProductsController } from 'src/modules/products/controllers/products.controller';
import { Category } from 'src/modules/products/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { CategoriesService } from 'src/modules/products/services/categories.service';
import { ProductsService } from 'src/modules/products/services/products.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Product])],
  controllers: [CategoriesController, ProductsController],
  providers: [CategoriesService, ProductsService],
})
export class ProductsModule {}
