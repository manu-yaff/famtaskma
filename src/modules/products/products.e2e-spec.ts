import { faker } from '@faker-js/faker/.';
import {
  BadRequestException,
  HttpStatus,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as http from 'node:http';
import { DatabaseConfigModule } from 'src/database/database.module';
import { ProductsController } from 'src/modules/products/controllers/products.controller';
import { CreateProductDto } from 'src/modules/products/dto/create-product-input.dto';
import { Category } from 'src/modules/products/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { getProductMock } from 'src/modules/products/mocks/product.entity.mock';
import { ProductsModule } from 'src/modules/products/products.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe(ProductsController.name, () => {
  let app: INestApplication;
  let nestServer: http.Server;
  let productsRepository: Repository<Product>;
  let categoriesRepository: Repository<Category>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        DatabaseConfigModule,
        ProductsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    nestServer = app.getHttpServer() as http.Server;
    productsRepository = moduleRef.get(getRepositoryToken(Product));
    categoriesRepository = moduleRef.get(getRepositoryToken(Category));
  });

  beforeEach(async () => {
    await productsRepository.delete({});
    await categoriesRepository.delete({});
  });

  afterAll(async () => {
    await productsRepository.delete({});
    await categoriesRepository.delete({});
    await app.close();
  });

  const productsEndpoint = '/products';

  describe(ProductsController.prototype.findAll.name, () => {
    it('should return products', async () => {
      // Arrange
      const category = await categoriesRepository.save({
        name: faker.food.description(),
      });

      const productsMocks = [
        getProductMock({ category }),
        getProductMock({ category }),
      ];

      await productsRepository.save(productsMocks);

      // Act
      const response = await request(nestServer).get(productsEndpoint);
      const body = response.body as Array<Product>;

      // Assert
      expect(response.status).toBe(HttpStatus.OK);

      expect(body).toBeInstanceOf(Array<Product>);
      expect(body).toHaveLength(productsMocks.length);
    });
  });

  describe(ProductsController.prototype.create.name, () => {
    it('should create product', async () => {
      // Arrange
      const category = await categoriesRepository.save({
        name: faker.food.description(),
      });

      const payload: CreateProductDto = {
        name: faker.food.fruit(),
        description: faker.food.description(),
        categoryId: category.id,
      };

      // Act
      const response = await request(nestServer)
        .post(productsEndpoint)
        .send(payload);

      const body = response.body as Product;

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);

      expect(body.id).toEqual(expect.any(String));
      expect(body.name).toBe(payload.name);
      expect(body.description).toBe(payload.description);
      expect(body.category.id).toBe(payload.categoryId);
      expect(body.createdAt).toEqual(expect.any(String));
      expect(body.updatedAt).toEqual(expect.any(String));
    });

    it(`should throw ${BadRequestException.name} when sending an invalid category id`, async () => {
      // Arrange

      // Act
      const response = await request(nestServer).post(productsEndpoint).send({
        name: 'melon',
        description: 'white melon',
      });

      // Assert
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });
  });
});
