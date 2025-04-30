import {
  HttpStatus,
  INestApplication,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as http from 'node:http';
import { AppModule } from 'src/app.module';
import { ShoppingListsController } from 'src/modules/products/controllers/shopping-lists.controller';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { Category } from 'src/modules/products/entities/category.entity';
import { Product } from 'src/modules/products/entities/product.entity';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import {
  getCreateShoppingListDtoMock,
  getShoppingListEntityMock,
} from 'src/modules/products/mocks/shopping-list.mock';
import { User } from 'src/modules/users/entities/user.entity';
import { HttpExceptionFilter } from 'src/shared/exception-filter';
import { setupUser } from 'src/shared/test/setup-helper-e2e';
import {
  ControllerResponse,
  TransformInterceptor,
} from 'src/shared/transform.interceptor';
import * as request from 'supertest';
import { Repository } from 'typeorm';

describe(ShoppingListsController.name, () => {
  let app: INestApplication;
  let nestServer: http.Server;
  let usersRepository: Repository<User>;
  let productsRepository: Repository<Product>;
  let categoriesRepository: Repository<Category>;
  let shoppingListsRepository: Repository<ShoppingList>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    const logger = new Logger();

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new HttpExceptionFilter(logger));
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();

    nestServer = app.getHttpServer() as http.Server;

    usersRepository = moduleRef.get(getRepositoryToken(User));
    productsRepository = moduleRef.get(getRepositoryToken(Product));
    categoriesRepository = moduleRef.get(getRepositoryToken(Category));
    shoppingListsRepository = moduleRef.get(getRepositoryToken(ShoppingList));
  });

  beforeEach(async () => {
    await shoppingListsRepository.delete({});
    await productsRepository.delete({});
    await categoriesRepository.delete({});
    await usersRepository.delete({});
  });

  afterAll(async () => {
    await shoppingListsRepository.delete({});
    await productsRepository.delete({});
    await categoriesRepository.delete({});
    await usersRepository.delete({});

    await app.close();
  });

  const shoppingListsResource = '/shopping-lists';

  describe(ShoppingListsController.prototype.findAll.name, () => {
    it('should return shopping lists for user', async () => {
      // Arrange
      const loginResponse = await setupUser(nestServer);

      await request(nestServer)
        .post(shoppingListsResource)
        .set('Authorization', `Bearer ${loginResponse.data.accessToken}`)
        .send(getShoppingListEntityMock());

      await request(nestServer)
        .post(shoppingListsResource)
        .set('Authorization', `Bearer ${loginResponse.data.accessToken}`)
        .send(getShoppingListEntityMock());

      // Act
      const response = await request(nestServer)
        .get(shoppingListsResource)
        .set('Authorization', `Bearer ${loginResponse.data.accessToken}`);

      const body = response.body as ControllerResponse<Array<ShoppingList>>;

      // Assert
      expect(response.status).toBe(HttpStatus.OK);

      expect(body.data).toBeInstanceOf(Array<Product>);
      expect(body.data).toHaveLength(2);
    });
  });

  describe.only(ShoppingListsController.prototype.create.name, () => {
    it(`should return ${HttpStatus.BAD_REQUEST} when name is not provided`, async () => {
      // Arrange
      const loginResponse = await setupUser(nestServer);

      // Act
      const response = await request(nestServer)
        .post(shoppingListsResource)
        .set('Authorization', `Bearer ${loginResponse.data.accessToken}`)
        .send({});

      // Assert
      expect(response.status).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should return the created shopping list', async () => {
      // Arrange
      const loginResponse = await setupUser(nestServer);
      const dto: CreateShoppingListDto = getCreateShoppingListDtoMock();

      // Act
      const response = await request(nestServer)
        .post(shoppingListsResource)
        .set('Authorization', `Bearer ${loginResponse.data.accessToken}`)
        .send(dto);

      const { data } = response.body as ControllerResponse<ShoppingList>;

      // Assert
      expect(response.status).toBe(HttpStatus.CREATED);

      expect(data.id).toEqual(expect.any(String));
      expect(data.name).toBe(dto.name);
      expect(data.users[0]).toEqual(expect.any(Array));
      expect(data.createdAt).toEqual(expect.any(String));
      expect(data.updatedAt).toEqual(expect.any(String));
    });
  });
});
