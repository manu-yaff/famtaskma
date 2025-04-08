import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfigModule } from 'src/database/database.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseConfigModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
