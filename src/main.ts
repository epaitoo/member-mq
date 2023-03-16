import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );

  const config = app.get(ConfigService);
  app.enableCors();
  app.setGlobalPrefix('api');
  await app.listen(config.get('port'));
}
bootstrap();
