import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { UsersService } from 'src/modules/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListsRepository: Repository<ShoppingList>,

    private readonly usersService: UsersService,
  ) {}

  public async create(dto: CreateShoppingListDto): Promise<ShoppingList> {
    try {
      const user = await this.usersService.findOne(dto.userId);

      return await this.shoppingListsRepository.save({
        name: dto.name,
        users: [user],
      });
    } catch (error: unknown) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new InternalServerErrorException('Error saving list', {
        cause: (error as Error)?.message,
      });
    }
  }
}
