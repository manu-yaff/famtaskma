import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateProductDto } from 'src/modules/products/dto/create-product.input';
import { ProductsService } from 'src/modules/products/services/products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get()
  public findAll() {
    return this.service.findAll();
  }

  @Post()
  public create(@Body() dto: CreateProductDto) {
    return this.service.create(dto);
  }
}
