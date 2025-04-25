import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCategoryDto } from 'src/modules/products/dto/create-category-input.dto';
import { Category } from 'src/modules/products/entities/category.entity';
import { PostgresDriverError, TypeormErrors } from 'src/shared/typeorm-errors';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>,
  ) {}

  public findAll(): Promise<Array<Category>> {
    return this.repository.find();
  }

  public async create(dto: CreateCategoryDto) {
    try {
      const entity = this.repository.create(dto);
      return await this.repository.save(entity);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as PostgresDriverError;

        if (driverError.code === TypeormErrors.duplicateKeyError) {
          throw new ConflictException();
        }
      }

      throw error;
    }
  }
}
