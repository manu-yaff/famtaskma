import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShoppingListDto } from 'src/modules/products/dto/create-shopping-list-input.dto';
import { ShoppingList } from 'src/modules/products/entities/shopping-list.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { mapErrorToHttpException } from 'src/shared/error-helper';
import { Repository } from 'typeorm';

@Injectable()
export class ShoppingListsService {
  constructor(
    @InjectRepository(ShoppingList)
    private readonly shoppingListsRepository: Repository<ShoppingList>,

    private readonly usersService: UsersService,
  ) {}

  public async create(
    dto: CreateShoppingListDto,
    userId: string,
  ): Promise<ShoppingList> {
    try {
      const user = await this.usersService.findOneByIdOrFail(userId);

      return await this.shoppingListsRepository.save({
        name: dto.name,
        users: [user],
      });
    } catch (error) {
      throw mapErrorToHttpException(error);
    }
  }

  public async findOneByIdOrFail(id: string) {
    try {
      return await this.shoppingListsRepository.findOneByOrFail({ id });
    } catch (error: unknown) {
      throw mapErrorToHttpException(error);
    }
  }

  public async findAllByUserEmail(email: string) {
    try {
      return await this.shoppingListsRepository.findBy({ users: { email } });
    } catch (error) {
      throw mapErrorToHttpException(error);
    }
  }

  public async findOneByIdAndUser(id: string, userId: string) {
    try {
      return await this.shoppingListsRepository.find({
        where: {
          id,
          users: { id: userId },
        },
        relations: ['items'],
      });
    } catch (error) {
      throw mapErrorToHttpException(error);
    }
  }
}
