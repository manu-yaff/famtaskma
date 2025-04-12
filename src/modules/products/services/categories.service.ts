import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TyperomDuplicatedKeyErrorCode } from 'src/constants';
import { CreateCategoryDto } from 'src/modules/products/dto/create-category.input';
import { Category } from 'src/modules/products/entities/category.entity';
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
        if ('code' in error && error.code === TyperomDuplicatedKeyErrorCode) {
          throw new ConflictException('Category already exists');
        }
      }
    }
  }
}
