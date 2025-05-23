import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShoppingItemDto } from 'src/modules/products/dto/create-shopping-item-input.dto';
import {
  ShoppingItem,
  ShoppingItemStatus,
} from 'src/modules/products/entities/shopping-item.entity';
import { ProductsService } from 'src/modules/products/services/products.service';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { UsersService } from 'src/modules/users/services/users.service';
import { mapErrorToHttpException } from 'src/shared/error-helper';
import { Repository } from 'typeorm';

@Injectable()
export class ShoppingItemsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly shoppingListsService: ShoppingListsService,

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
}
