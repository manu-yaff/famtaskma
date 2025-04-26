import { faker } from '@faker-js/faker/.';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as http from 'node:http';
import { DatabaseConfigModule } from 'src/database/database.module';
import { ShoppingItemController } from 'src/modules/products/controllers/shopping-item.controller';
import { CreateShoppingItemDto } from 'src/modules/products/dto/create-shopping-item-input.dto';
import { Category } from 'src/modules/products/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ShoppingItem } from 'src/modules/products/entities/shopping-item.entity';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { getCategoryEntityMock } from 'src/modules/products/mocks/category.mock';
import { getProductEntityMock } from 'src/modules/products/mocks/product.mock';
import { getCreateShoppingItemDtoMock } from 'src/modules/products/mocks/shopping-item.mock';
import { getShoppingListEntityMock } from 'src/modules/products/mocks/shopping-list.mock';
import { ProductsModule } from 'src/modules/products/products.module';
import { User } from 'src/modules/users/entities/user.entity';
import { getUserEntityMock } from 'src/modules/users/mocks/user.mock';
import * as request from 'supertest';
import { Repository } from 'typeorm';

const USERS_REPOSITORY_TOKEN = getRepositoryToken(User);
const PRODUCTS_REPOSITORY_TOKEN = getRepositoryToken(Product);
const SHOPPING_LISTS_REPOSITORY_TOKEN = getRepositoryToken(ShoppingList);
const CATEGORIES_REPOSITORY_TOKEN = getRepositoryToken(Category);
const SHOPPING_ITEMS_REPOSITORY_TOKEN = getRepositoryToken(ShoppingItem);

describe(ShoppingItemController.name, () => {
  let app: INestApplication;
  let nestServer: http.Server;

  let usersRepository: Repository<User>;
  let categoriesRepository: Repository<Category>;
  let productsRepository: Repository<Product>;
  let shoppingListsRepository: Repository<ShoppingList>;
  let shoppingItemsRepository: Repository<ShoppingItem>;

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

    usersRepository = app.get(USERS_REPOSITORY_TOKEN);
    productsRepository = app.get(PRODUCTS_REPOSITORY_TOKEN);
    categoriesRepository = app.get(CATEGORIES_REPOSITORY_TOKEN);
    shoppingListsRepository = app.get(SHOPPING_LISTS_REPOSITORY_TOKEN);
    shoppingItemsRepository = app.get(SHOPPING_ITEMS_REPOSITORY_TOKEN);
  });

  afterAll(async () => {
    await shoppingItemsRepository.delete({});
    await productsRepository.delete({});
    await shoppingListsRepository.delete({});
    await categoriesRepository.delete({});
    await usersRepository.delete({});

    await app.close();
  });

  beforeEach(async () => {
    await shoppingItemsRepository.delete({});
    await productsRepository.delete({});
    await shoppingListsRepository.delete({});
    await categoriesRepository.delete({});
    await usersRepository.delete({});
  });

  describe(ShoppingItemController.prototype.create.name, () => {
    const shoppingItemResource = '/shopping-items';

    describe('Input validation', () => {
      it(`should throw ${HttpStatus.BAD_REQUEST} when user id is not valid`, async () => {
        // Arrange
        const payload: CreateShoppingItemDto = getCreateShoppingItemDtoMock({
          userId: 'invalid-user-id',
        });

        // Act
        const response = await request(nestServer)
          .post(shoppingItemResource)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should throw ${HttpStatus.BAD_REQUEST} when product id not valid`, async () => {
        // Arrange
        const payload: CreateShoppingItemDto = getCreateShoppingItemDtoMock({
          productId: 'invalid-product-id',
        });

        // Act
        const response = await request(nestServer)
          .post(shoppingItemResource)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });

      it(`should throw ${HttpStatus.BAD_REQUEST} when shopping list id not valid`, async () => {
        // Arrange
        const payload: CreateShoppingItemDto = getCreateShoppingItemDtoMock({
          shoppingListId: 'invalid-shopping-list-id',
        });

        // Act
        const response = await request(nestServer)
          .post(shoppingItemResource)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    // TODO: should define the resource for the not found
    it(`should throw ${HttpStatus.NOT_FOUND} if user is not found`, async () => {
      // Arrange
      const category = await categoriesRepository.save(getCategoryEntityMock());

      const product = await productsRepository.save(
        getProductEntityMock({ category }),
      );

      const user = await usersRepository.save(getUserEntityMock());

      const shoppingList = await shoppingListsRepository.save(
        getShoppingListEntityMock({ users: [user] }),
      );

      const payload = getCreateShoppingItemDtoMock({
        userId: faker.string.uuid(),
        productId: product.id,
        shoppingListId: shoppingList.id,
      });

      // Act
      const response = await request(nestServer)
        .post(shoppingItemResource)
        .send(payload);

      // Assert
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it(`should throw ${HttpStatus.NOT_FOUND} if product is not found`, async () => {
      // Arrange
      const invalidProductId = faker.string.uuid();

      const user = await usersRepository.save(getUserEntityMock());

      const shoppingList = await shoppingListsRepository.save(
        getShoppingListEntityMock({ users: [user] }),
      );

      const payload = getCreateShoppingItemDtoMock({
        userId: user.id,
        productId: invalidProductId,
        shoppingListId: shoppingList.id,
      });

      // Act
      const response = await request(nestServer)
        .post(shoppingItemResource)
        .send(payload);

      // Assert
      expect(response.status).toBe(HttpStatus.NOT_FOUND);
    });

    it(`should throw ${HttpStatus.NOT_FOUND} if shopping list is not found`, async () => {
      // Arrange
      try {
        const user = await usersRepository.save(getUserEntityMock());
        const category = await categoriesRepository.save(
          getCategoryEntityMock(),
        );
        const product = await productsRepository.save(
          getProductEntityMock({ category }),
        );

        const invalidShoppingListId = faker.string.uuid();

        const payload: CreateShoppingItemDto = getCreateShoppingItemDtoMock({
          userId: user.id,
          productId: product.id,
          shoppingListId: invalidShoppingListId,
        });

        // Act
        const response = await request(nestServer)
          .post(shoppingItemResource)
          .send(payload);

        // Assert
        expect(response.status).toBe(HttpStatus.NOT_FOUND);
      } catch (error) {
        console.log(error);
      }
    });

    it(`should return ${HttpStatus.CREATED} when shopping item is created correctly`, async () => {
      // Arrange
      const user = await usersRepository.save(getUserEntityMock());
      const category = await categoriesRepository.save(getCategoryEntityMock());
      const product = await productsRepository.save(
        getProductEntityMock({ category }),
      );
      const shoppingList = await shoppingListsRepository.save(
        getShoppingListEntityMock({ users: [user] }),
      );

      const payload: CreateShoppingItemDto = getCreateShoppingItemDtoMock({
        userId: user.id,
        productId: product.id,
        shoppingListId: shoppingList.id,
      });

      // Act
      const response = await request(nestServer)
        .post(shoppingItemResource)
        .send(payload);

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);
    });
  });
});
