import { Body, Controller, Get, Post } from '@nestjs/common';
import {
  CurrentUser,
  CurrentUserFromToken,
} from 'src/modules/auth/decorators/current-user.decorator';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';

@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  public create(
    @Body() dto: CreateShoppingListDto,
    @CurrentUser() user: CurrentUserFromToken,
  ) {
    return this.shoppingListsService.create({ name: dto.name }, user.id);
  }

  @Get()
  public findAll(@CurrentUser() user: CurrentUserFromToken) {
    return this.shoppingListsService.findAllByUserEmail(user.email);
  }
}
