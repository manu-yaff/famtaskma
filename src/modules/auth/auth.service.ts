import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SigninInputDto } from 'src/modules/auth/dto/signin-input.dto';
import { SigninResponseDto } from 'src/modules/auth/dto/signin-response.dto';
import { UsersService } from 'src/modules/users/users.service';

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

      throw error;
    }
  }
}
