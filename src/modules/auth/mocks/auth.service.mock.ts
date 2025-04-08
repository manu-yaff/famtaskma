import { AuthService } from 'src/modules/auth/auth.service';

export function getAuthServiceMock(): jest.Mocked<Partial<AuthService>> {
  return {
    signin: jest.fn(),
  };
}
