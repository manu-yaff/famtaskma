import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignupResponseDto } from 'src/modules/auth/dto/signup-response.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { mapErrorToHttpException } from 'src/shared/error-helper';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(dto: CreateUserDto): Promise<SignupResponseDto> {
    try {
      return await this.usersRepository.save(dto);
    } catch (error) {
      throw mapErrorToHttpException(error);
    }
  }

  public async findOneByIdOrFail(id: string): Promise<User> {
    return await this.usersRepository.findOneByOrFail({ id });
  }

  public async findOneByEmailOrFail(email: string): Promise<User> {
    return await this.usersRepository.findOneByOrFail({ email });
  }
}
