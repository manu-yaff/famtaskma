import { JwtService } from '@nestjs/jwt';
import { MockType } from 'src/shared/test/mock.type';

export function getJwtServiceMock(): MockType<JwtService> {
  return {
    signAsync: jest.fn(),
  };
}
