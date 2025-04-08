import { Test } from '@nestjs/testing';
import { CreateUserDto } from 'src/modules/users/dto/create-user.input';
import { getUsersServiceMock } from 'src/modules/users/mocks/users.service.mock';
import { UsersController } from 'src/modules/users/users.controller';
import { UsersService } from 'src/modules/users/users.service';

describe(UsersController.name, () => {
  let controller: UsersController;
  let service: jest.Mocked<Partial<UsersService>>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: getUsersServiceMock(),
        },
      ],
    }).compile();

    controller = moduleRef.get(UsersController);
    service = moduleRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(UsersController.prototype.createUser.name, () => {
    it('should create user', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        name: 'jonh',
        email: 'jonh@gmail.com',
        password: 'password',
      };

      // Act
      await controller.createUser(createUserDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith({
        name: createUserDto.name,
        email: createUserDto.email,
        password: createUserDto.password,
      });
    });
  });
});
