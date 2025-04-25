import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SigninInputDto } from 'src/modules/auth/dto/signin-input.dto';
import { SigninResponseDto } from 'src/modules/auth/dto/signin-response.dto';
import { SignupResponseDto } from 'src/modules/auth/dto/signup-response.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user-input.dto';
import { UsersService } from 'src/modules/users/services/users.service';
import { mapErrorToHttpException } from 'src/shared/error-helper';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  public async signin(dto: SigninInputDto): Promise<SigninResponseDto> {
    try {
      const user = await this.usersService.findOneByEmailOrFail(dto.email);

      const passwordMatch = await bcrypt.compare(dto.password, user.password);

      if (!passwordMatch) {
        throw new UnauthorizedException();
      }

      const payload: JwtPayload = { sub: user.id, email: user.email };

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw new UnauthorizedException();

      throw mapErrorToHttpException(error);
    }
  }

  public async signup(dto: CreateUserDto): Promise<SignupResponseDto> {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(dto.password, salt);

      return await this.usersService.create({
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
      });
    } catch (error: unknown) {
      throw mapErrorToHttpException(error);
    }
  }
}
