import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG_KEYS, DATABASE_TYPE } from 'src/constants';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isTestingEnv =
          configService.getOrThrow(CONFIG_KEYS.ENVIRONMENT) === 'testing';

        return {
          type: DATABASE_TYPE,
          host: configService.getOrThrow(CONFIG_KEYS.DB_HOST),
          port: configService.getOrThrow(CONFIG_KEYS.DB_PORT),
          database: configService.getOrThrow(CONFIG_KEYS.DB_NAME),
          username: configService.getOrThrow(CONFIG_KEYS.DB_USERNAME),
          password: configService.getOrThrow(CONFIG_KEYS.DB_PASSWORD),
          logging: !isTestingEnv,
          synchronize: isTestingEnv,
          autoLoadEntities: true,
        };
      },
    }),
  ],
})
export class DatabaseConfigModule {}
