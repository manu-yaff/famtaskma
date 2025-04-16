import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupResponseDto } from 'src/modules/auth/dto/signup-response.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { EntityNotFoundError, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(dto: CreateUserDto): Promise<SignupResponseDto> {
    try {
      return await this.usersRepository.save(dto);
    } catch {
      throw new InternalServerErrorException();
    }
  }

  public async findOneByIdOrFail(id: string): Promise<User> {
    try {
      return await this.usersRepository.findOneByOrFail({ id });
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException();
      }

      throw new InternalServerErrorException();
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
