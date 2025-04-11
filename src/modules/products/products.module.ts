import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesController } from 'src/modules/products/controllers/categories.controller';
import { Category } from 'src/modules/products/entities/category.entity';
import { CategoriesService } from 'src/modules/products/services/categories.service';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class ProductsModule {}
