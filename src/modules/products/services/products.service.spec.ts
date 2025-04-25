import { faker } from '@faker-js/faker/.';
import { InternalServerErrorException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateProductDto } from 'src/modules/products/dto/create-product-input.dto';
import { Product } from 'src/modules/products/entities/product.entity';
import { getProductMock } from 'src/modules/products/mocks/product.entity.mock';
import { getProductsRepositoryMock } from 'src/modules/products/mocks/products.repository.mock';
import { ProductsService } from 'src/modules/products/services/products.service';
import { MockType } from 'src/shared/test/mock.type';
import { Repository } from 'typeorm';

const PRODUCTS_REPOSITORY_TOKEN = getRepositoryToken(Product);

describe(ProductsService.name, () => {
  let repository: MockType<Repository<Product>>;
  let service: ProductsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: PRODUCTS_REPOSITORY_TOKEN,
          useValue: getProductsRepositoryMock(),
        },
      ],
    }).compile();

    service = moduleRef.get(ProductsService);
    repository = moduleRef.get(PRODUCTS_REPOSITORY_TOKEN);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe(ProductsService.prototype.findAll.name, () => {
    it('should return an array of products', async () => {
      // Arrange
      const productsListMock: Array<Product> = [
        getProductMock(),
        getProductMock(),
      ];

      jest.spyOn(repository, 'find').mockResolvedValue(productsListMock);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(productsListMock);
    });

    it('should call products repository', async () => {
      // Arrange

      // Act
      await service.findAll();

      // Assert
      expect(repository.find).toHaveBeenCalledTimes(1);
    });

    it('should throw if repository throws', async () => {
      // Arrange
      const errorMock = new Error('Database error');

      jest.spyOn(repository, 'find').mockRejectedValue(errorMock);

      // Act
      const promise = service.findAll();

      // Assert
      await expect(promise).rejects.toThrow();
    });
  });

  describe(ProductsService.prototype.create.name, () => {
    it(`should call ${Repository.prototype.save.name} when creating a new product`, async () => {
      // Arrange
      const payload: CreateProductDto = {
        name: faker.food.fruit(),
        description: faker.food.description(),
        categoryId: faker.string.uuid(),
      };

      const productMock: Product = getProductMock();

      jest.spyOn(repository, 'create').mockReturnValue(productMock);

      // Act
      await service.create(payload);

      // Assert
      expect(repository.save).toHaveBeenCalledWith(productMock);
    });

    it('should return the created product', async () => {
      // Arrange
      const payload: CreateProductDto = {
        name: faker.food.fruit(),
        description: faker.food.description(),
        categoryId: faker.string.uuid(),
      };

      const productMock: Product = getProductMock();

      jest.spyOn(repository, 'save').mockResolvedValue(productMock);

      // Act
      const result = await service.create(payload);

      // Assert
      expect(result).toEqual(productMock);
    });

    it(`should throw ${InternalServerErrorException.name} if repository throws`, async () => {
      // Arrange
      const payload: CreateProductDto = {
        name: faker.food.fruit(),
        description: faker.food.ethnicCategory(),
        categoryId: faker.string.uuid(),
      };

      const mockError = new Error('database error');

      jest.spyOn(repository, 'save').mockRejectedValue(mockError);

      // Act
      const promise = service.create(payload);

      // Assert
      await expect(promise).rejects.toThrow(mockError);
    });
  });
});
