import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { CategoriesService } from 'src/modules/products/services/categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Public()
  @Get()
  public findAll() {
    return this.categoriesService.findAll();
  }
}
