import * as http from 'node:http';
import { SigninResponseDto } from 'src/modules/auth/dto/signin-response.dto';
import { ControllerResponse } from 'src/shared/transform.interceptor';
import * as request from 'supertest';

export async function setupUser(server: http.Server) {
  const testUserCredentials = {
    email: 'test@gmail.com',
    password: 'test',
  };

  const userCreationResponse = await request(server)
    .post('/auth/register')
    .send({ ...testUserCredentials, name: 'test' });

  if (userCreationResponse.statusCode !== 201) {
    throw new Error('Error creating user');
  }

  const loginResponse = await request(server)
    .post('/auth/login')
    .send(testUserCredentials);

  if (loginResponse.status !== 200) {
    throw new Error('Error authenticating user');
  }

  return loginResponse.body as ControllerResponse<SigninResponseDto>;
}
