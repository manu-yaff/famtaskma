import { faker } from '@faker-js/faker/.';
import { ConflictException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TyperomDuplicatedKeyErrorCode } from 'src/contants';
import { CreateCategoryDto } from 'src/modules/products/dto/create-category.input';
import { Category } from 'src/modules/products/entities/category.entity';
import {
  getCategoriesRepositoryMock,
  MockType,
} from 'src/modules/products/mocks/categories.repository.mock';
import { getCategoryMock } from 'src/modules/products/mocks/category.entity.mock';
import { CategoriesService } from 'src/modules/products/services/categories.service';
import { QueryFailedError, Repository } from 'typeorm';

const CATEGORIES_REPOSITORY_TOKEN = getRepositoryToken(Category);

describe(CategoriesService.name, () => {
  let service: CategoriesService;
  let repository: MockType<Repository<Category>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: CATEGORIES_REPOSITORY_TOKEN,
          useValue: getCategoriesRepositoryMock(),
        },
      ],
    }).compile();

    service = moduleRef.get<CategoriesService>(CategoriesService);
    repository = moduleRef.get(CATEGORIES_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(CategoriesService.prototype.findAll.name, () => {
    it('should return all the categories', async () => {
      // Arrange
      const categoriesMock: Category[] = [
        getCategoryMock({ name: 'fruits' }),
        getCategoryMock({ name: 'vegetables' }),
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(categoriesMock);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(2);
      expect(result).toEqual(categoriesMock);
    });

    it('should return all the categories', async () => {
      // Arrange
      const categoriesMock: Category[] = [];

      jest.spyOn(repository, 'find').mockResolvedValue(categoriesMock);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toBeInstanceOf(Array);
      expect(result).toHaveLength(0);
      expect(result).toEqual(categoriesMock);
    });
  });

  describe(CategoriesService.prototype.create.name, () => {
    it('should create category', async () => {
      // Arrange
      const categoryMock = faker.food.ethnicCategory();

      const payload: CreateCategoryDto = {
        name: categoryMock,
      };

      const categoryEntityMock: Category = {
        id: faker.string.uuid(),
        name: payload.name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(repository, 'create').mockReturnValue(categoryEntityMock);

      // Act
      await service.create(payload);

      // Assert
      expect(repository.create).toHaveBeenCalledWith(payload);
      expect(repository.save).toHaveBeenCalledWith(categoryEntityMock);
    });

    it(`throw ${ConflictException.name} when category already exists`, async () => {
      // Arrange
      const payload: CreateCategoryDto = {
        name: faker.food.ethnicCategory(),
      };

      const duplicatedKeyError = new QueryFailedError('INSERT INTO', [], {
        code: TyperomDuplicatedKeyErrorCode,
      } as any);

      jest.spyOn(repository, 'save').mockRejectedValue(duplicatedKeyError);

      // Act
      const promise = service.create(payload);

      // Assert
      await expect(promise).rejects.toThrow(ConflictException);
    });
  });
});
