import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShoppingListItemDto } from 'src/modules/products/dto/create-shopping-list-item-input.dto';
import {
  ShoppingItemStatus,
  ShoppingListItem,
} from 'src/modules/products/entities/shopping-list-item.entity';
import { ProductsService } from 'src/modules/products/services/products.service';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ShoppingListItemsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly shoppingListsService: ShoppingListsService,

    @InjectRepository(ShoppingListItem)
    private readonly repository: Repository<ShoppingListItem>,
  ) {}

  public async create(dto: CreateShoppingListItemDto) {
    await this.usersService.findOneByIdOrFail(dto.userId);
    await this.productsService.findOneByIdOrFail(dto.productId);
    await this.shoppingListsService.findOneByIdOrFail(dto.shoppingListId);

    return await this.repository.save({
      ...dto,
      status: ShoppingItemStatus.Todo,
    });
  }
}
