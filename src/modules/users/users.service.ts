import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupResponseDto } from 'src/modules/auth/dto/signup-response.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { mapErrorToHttpException } from 'src/shared/error-helper';
import { PostgresDriverError, TypeormErrors } from 'src/shared/typeorm-errors';
import { EntityNotFoundError, QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(dto: CreateUserDto): Promise<SignupResponseDto> {
    try {
      const user = await this.usersRepository.save(dto);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        shoppingLists: user.shoppingLists,
      };
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as PostgresDriverError;

        if (driverError.code === TypeormErrors.duplicateKeyError) {
          throw new ConflictException();
        }
      }

      throw new InternalServerErrorException();
    }
  }

  public async findOneByIdOrFail(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error: unknown) {
      throw mapErrorToHttpException(error);
    }
  }

  public async findOneByEmailOrFail(email: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ email });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }
      throw error;
    }
  }
}
