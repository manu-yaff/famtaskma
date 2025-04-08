import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/modules/users/dto/create-user.input';
import { User } from 'src/modules/users/entities/user.entity';
import { QueryFailedError, Repository } from 'typeorm';

export class UserUnexpectedError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class EmailAlreadyInUseError extends HttpException {
  constructor(message: string) {
    super(
      { status: HttpStatus.CONFLICT, error: 'Email already exists' },
      HttpStatus.CONFLICT,
      { cause: message },
    );
  }
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public async create(createUserInput: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashed_password = await bcrypt.hash(createUserInput.password, salt);

    const newUser = this.usersRepository.create({
      name: createUserInput.name,
      email: createUserInput.email,
      password: hashed_password,
    });

    try {
      return await this.usersRepository.save(newUser);
    } catch (error: unknown) {
      if (error instanceof QueryFailedError) {
        if ((error.driverError as { code: string }).code) {
          throw new EmailAlreadyInUseError(error.message);
        }
      }

      throw new UserUnexpectedError((error as Error).message);
    }
  }
}
