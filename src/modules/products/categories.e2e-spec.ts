import { faker } from '@faker-js/faker/.';
import {
  ConflictException,
  HttpStatus,
  INestApplication,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as http from 'node:http';
import { DatabaseConfigModule } from 'src/database/database.module';
import { CategoriesController } from 'src/modules/products/controllers/categories.controller';
import { CreateCategoryDto } from 'src/modules/products/dto/create-category-input.dto';
import { Category } from 'src/modules/products/entities/category.entity';
import { getCategoryMock } from 'src/modules/products/mocks/category.entity.mock';
import { ProductsModule } from 'src/modules/products/products.module';
import * as request from 'supertest';
import { Repository } from 'typeorm';

const CATEGORIES_REPOSITORY_TOKEN = getRepositoryToken(Category);

describe(CategoriesController.name, () => {
  let nestServer: http.Server;
  let app: INestApplication;
  let repository: Repository<Category>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env.test' }),
        DatabaseConfigModule,
        ProductsModule,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();

    nestServer = app.getHttpServer() as http.Server;

    repository = moduleRef.get<Repository<Category>>(
      CATEGORIES_REPOSITORY_TOKEN,
    );
  });

  beforeEach(async () => {
    await repository.delete({});
  });

  afterAll(async () => {
    await repository.delete({});
    await app.close();
  });

  const categoriesEndpoint = '/categories';

  describe(CategoriesController.prototype.findAll.name, () => {
    it('should list all categories', async () => {
      // Arrange
      const c1 = repository.create(getCategoryMock({ name: 'fruits' }));
      const c2 = repository.create(getCategoryMock({ name: 'vegetables' }));
      await repository.save([c1, c2]);

      // Act
      const response = await request(nestServer).get(categoriesEndpoint);
      const body = response.body as Array<Category>;

      // Assert
      expect(response.status).toBe(HttpStatus.OK);
      expect(body).toHaveLength(2);
    });
  });

  describe(CategoriesController.prototype.create.name, () => {
    it(`should throw ${ConflictException.name} when category already exists`, async () => {
      // Arrange
      const payload: CreateCategoryDto = {
        name: faker.food.ethnicCategory(),
      };

      await request(nestServer).post(categoriesEndpoint).send(payload);

      // Act
      const response = await request(nestServer)
        .post(categoriesEndpoint)
        .send(payload);

      // Arrange
      expect(response.status).toBe(HttpStatus.CONFLICT);
    });

    it('should create category', async () => {
      // Arrange
      const payload: CreateCategoryDto = {
        name: faker.food.ethnicCategory(),
      };

      // Act
      const response = await request(nestServer)
        .post(categoriesEndpoint)
        .send(payload);

      const body = response.body as Category;

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);

      expect(body.id).toEqual(expect.any(String));
      expect(body.name).toEqual(payload.name);
      expect(body.createdAt).toEqual(expect.any(String));
      expect(body.updatedAt).toEqual(expect.any(String));
    });
  });
});
