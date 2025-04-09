import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Category } from 'src/modules/products/entities/category.entity';
import { getCategoriesRepositoryMock } from 'src/modules/products/mocks/categories.repository.mock';
import { getCategoryMock } from 'src/modules/products/mocks/category.entity.mock';
import { CategoriesService } from 'src/modules/products/services/categories.service';
import { Repository } from 'typeorm';

const CATEGORIES_REPOSITORY_TOKEN = getRepositoryToken(Category);

describe(CategoriesService.name, () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

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
    repository = moduleRef.get<Repository<Category>>(
      CATEGORIES_REPOSITORY_TOKEN,
    );
  });

  it.only('should be defined', () => {
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

    it.todo('should return empty array when there are no categories');
  });
});
