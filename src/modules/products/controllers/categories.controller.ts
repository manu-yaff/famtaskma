import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { CreateCategoryDto } from 'src/modules/products/dto/create-category.input';
import { CategoriesService } from 'src/modules/products/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  public findAll() {
    return this.categoriesService.findAll();
  }

  @Post()
  public create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto);
  }
}
