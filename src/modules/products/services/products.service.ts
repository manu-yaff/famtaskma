import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/modules/products/dto/create-product-input.dto';
import { Product } from 'src/modules/products/entities/product.entity';
import { mapErrorToHttpException } from 'src/shared/error-helper';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly repository: Repository<Product>,
  ) {}

  public async findAll(): Promise<Product[]> {
    return this.repository.find();
  }

  public create(dto: CreateProductDto) {
    const entity = this.repository.create({
      name: dto.name,
      description: dto.description,
      category: { id: dto.categoryId },
    });

    return this.repository.save(entity);
  }

  public findOneByIdOrFail(id: string): Promise<Product> {
    try {
      return this.repository.findOneByOrFail({ id });
    } catch (error: unknown) {
      throw mapErrorToHttpException(error);
    }
  }
}
