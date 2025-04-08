import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SigninDto } from 'src/modules/auth/dto/signin-input';
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

  public async signin(dto: SigninDto): Promise<Record<string, string>> {
    const user = await this.usersService.findOne(dto.email);

    const passwordMatch = await bcrypt.compare(dto.password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { sub: user.id, email: user.email };

    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
