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
import { ShoppingListsController } from 'src/modules/products/controllers/shopping-lists.controller';
import { CreateProductDto } from 'src/modules/products/dto/create-product-input.dto';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { Category } from 'src/modules/products/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { getProductMock } from 'src/modules/products/mocks/product.entity.mock';
import { ProductsModule } from 'src/modules/products/products.module';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';
import { User } from 'src/modules/users/entities/user.entity';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe(ProductsController.name, () => {
  let app: INestApplication;
  let nestServer: http.Server;
  let productsRepository: Repository<Product>;
  let categoriesRepository: Repository<Category>;
  let usersRepository: Repository<User>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [
        // AuthModule,
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
    usersRepository = moduleRef.get(getRepositoryToken(User));
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

  describe(ShoppingListsController.prototype.create.name, () => {
    const shoppingListsEndpoint = '/shopping-lists';

    it(`should return ${HttpStatus.BAD_REQUEST} when receiving invalid user id`, async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
        userId: 'invalid-user-id',
      };

      // Act
      const response = await request(nestServer)
        .post(shoppingListsEndpoint)
        .send(payload);

      // Assert
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it(`should return ${HttpStatus.NOT_FOUND} when user does not exist`, async () => {
      // Arrange
      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
        userId: faker.string.uuid(),
      };

      // Act
      const response = await request(nestServer)
        .post(shoppingListsEndpoint)
        .send(payload);

      // Assert
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it(`should return the created shopping list`, async () => {
      // Arrange
      const createUserPayload: CreateUserDto = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const user = await usersRepository.save(createUserPayload);

      const payload: CreateShoppingListDto = {
        name: faker.word.words(),
        userId: user.id,
      };

      // Act
      const response = await request(nestServer)
        .post(shoppingListsEndpoint)
        .send(payload);

      const body = response.body as ShoppingList;

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);

      expect(body.id).toEqual(expect.any(String));
      expect(body.name).toBe(payload.name);
      expect(body.users[0]).toEqual(expect.objectContaining({ id: user.id }));
      expect(body.createdAt).toEqual(expect.any(String));
      expect(body.updatedAt).toEqual(expect.any(String));
    });
  });
});
