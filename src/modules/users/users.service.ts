import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { SignupResponseDto } from 'src/modules/auth/dto/signup-response.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(
    createUserInput: CreateUserDto,
  ): Promise<SignupResponseDto> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUserInput.password, salt);

    const newUser = this.usersRepository.create({
      name: createUserInput.name,
      email: createUserInput.email,
      password: hashedPassword,
    });

    try {
      return await this.usersRepository.save(newUser);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        if ((error.driverError as { code: string }).code) {
          // TODO as error code here
          throw new ConflictException('Email already in use');
        }
      }

      throw new InternalServerErrorException('User: unexpected error');
    }
  }

  public async findOneByEmail(email: string): Promise<User> {
    const user = await this.usersRepository.findOneBy({ email });

    if (user === null) throw new NotFoundException();

    return user;
  }
}
