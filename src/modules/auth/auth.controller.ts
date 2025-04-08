import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { SigninDto } from 'src/modules/auth/dto/signin-input';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/login')
  public signin(@Body() dto: SigninDto) {
    return this.authService.signin(dto);
  }
}
