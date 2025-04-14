import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/shared/exception-filter';
import { TransformInterceptor } from 'src/shared/transform.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const docsConfig = new DocumentBuilder()
    .setTitle('Famtaskma docs')
    .setDescription('Famtaskma Rest API')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, docsConfig);
  const docsPath = 'api';

  SwaggerModule.setup(docsPath, app, documentFactory);

  const logger = new Logger();

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter(logger));
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
