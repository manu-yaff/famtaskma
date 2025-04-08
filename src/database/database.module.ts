import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_KEYS, DATABASE_TYPE } from 'src/contants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: DATABASE_TYPE,
          host: configService.getOrThrow(CONFIG_KEYS.DB_HOST),
          port: configService.getOrThrow(CONFIG_KEYS.DB_PORT),
          database: configService.getOrThrow(CONFIG_KEYS.DB_NAME),
          username: configService.getOrThrow(CONFIG_KEYS.DB_USERNAME),
          password: configService.getOrThrow(CONFIG_KEYS.DB_PASSWORD),
          synchronize:
            configService.getOrThrow(CONFIG_KEYS.ENVIRONMENT) === 'testing'
              ? true
              : false,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseConfigModule {}
