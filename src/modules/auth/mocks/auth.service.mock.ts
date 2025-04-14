import { AuthService } from 'src/modules/auth/auth.service';
import { MockType } from 'src/shared/test/mock.type';

export function getAuthServiceMock(): MockType<AuthService> {
  return {
    signin: jest.fn(),
  };
}
