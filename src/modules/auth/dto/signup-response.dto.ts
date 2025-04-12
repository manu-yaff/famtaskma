import { OmitType } from '@nestjs/swagger';
import { User } from 'src/modules/users/entities/user.entity';

export class SignupResponseDto extends OmitType(User, ['password']) {}
