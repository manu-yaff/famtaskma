import { Body, Controller, Get, Post } from '@nestjs/common';
import { CurrentUserEmail } from 'src/modules/auth/decorators/current-user.decorator';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { ShoppingListsService } from 'src/modules/products/services/shopping-lists.service';

@Controller('shopping-lists')
export class ShoppingListsController {
  constructor(private readonly shoppingListsService: ShoppingListsService) {}

  @Post()
  public create(@Body() dto: CreateShoppingListDto) {
    return this.shoppingListsService.create(dto);
  }

  @Get()
  public findAll(@CurrentUserEmail() email: string) {
    return this.shoppingListsService.findAllByUserEmail(email);
  }
}
