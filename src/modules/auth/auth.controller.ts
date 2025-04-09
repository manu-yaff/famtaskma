import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { SigninDto } from 'src/modules/auth/dto/signin-input';
import { CreateUserDto } from 'src/modules/users/dto/create-user.input';
import { UsersService } from 'src/modules/users/users.service';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Public()
  @Post('/login')
  public signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }

  @Public()
  @Post('/register')
  public register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
