import { JwtService } from '@nestjs/jwt';

export function getJwtServiceMock(): Partial<jest.Mocked<JwtService>> {
  return {
    signAsync: jest.fn(),
  };
}
