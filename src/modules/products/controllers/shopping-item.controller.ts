import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import {
  CurrentUser,
  CurrentUserFromToken,
} from 'src/modules/auth/decorators/current-user.decorator';
import { CreateShoppingItemDto } from 'src/modules/products/dto/create-shopping-item-input.dto';
import { ShoppingItemsService } from 'src/modules/products/services/shopping-items.service';

@ApiBearerAuth()
@Controller('shopping-items')
export class ShoppingItemController {
  constructor(private readonly service: ShoppingItemsService) {}

  @Post()
  public create(
    @CurrentUser() user: CurrentUserFromToken,
    @Body() dto: CreateShoppingItemDto,
  ) {
    return this.service.create(dto, user.id);
  }
}
