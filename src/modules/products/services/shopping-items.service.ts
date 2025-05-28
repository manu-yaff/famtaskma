import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShoppingItemDto } from 'src/modules/products/dto/create-shopping-item-input.dto';
import { CreateShoppingItemWithProductDto } from 'src/modules/products/dto/create-shopping-item-with-product.dto';
import { Product } from 'src/modules/products/entities/product.entity';
import {
  ShoppingItem,
  ShoppingItemStatus,
} from 'src/modules/products/entities/shopping-item.entity';
import { ProductsService } from 'src/modules/products/services/products.service';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { mapErrorToHttpException } from 'src/shared/error-helper';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ShoppingItemsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly shoppingListsService: ShoppingListsService,

    private dataSource: DataSource,

    @InjectRepository(ShoppingItem)
    private readonly repository: Repository<ShoppingItem>,
  ) {}

  public async create(dto: CreateShoppingItemDto, userId: string) {
    try {
      // TODO: send this request concurrently
      await this.usersService.findOneByIdOrFail(userId);
      await this.productsService.findOneByIdOrFail(dto.productId);
      await this.shoppingListsService.findOneByIdOrFail(dto.shoppingListId);

      const shoppingItem = this.repository.create({
        quantity: dto.quantity,
        quantityType: dto.quantityType,
        notes: dto.notes,
        location: dto.location,
        status: ShoppingItemStatus.Todo,
        shoppingList: { id: dto.shoppingListId },
        product: { id: dto.productId },
        user: { id: userId },
      });

      return await this.repository.save(shoppingItem);
    } catch (error) {
      throw mapErrorToHttpException(error);
    }
  }

  public async createWithProduct(
    dto: CreateShoppingItemWithProductDto,
    userId: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const product = queryRunner.manager.create(Product, {
        name: dto.name,
        description: dto.description,
        category: { id: dto.category },
      });

      await queryRunner.manager.save(product);

      const shoppingItem = queryRunner.manager.create(ShoppingItem, {
        quantity: dto.quantity,
        quantityType: dto.quantityType,
        location: dto.location,
        notes: dto.notes,
        status: ShoppingItemStatus.Todo,
        shoppingList: { id: dto.shoppingListId },
        product: { id: product.id },
        user: { id: userId },
      });

      await queryRunner.manager.save(shoppingItem);

      return shoppingItem;
    } catch (error) {
      throw mapErrorToHttpException(error);
    }
  }
}
