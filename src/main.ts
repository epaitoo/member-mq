import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );

  const config = app.get(ConfigService);
  await app.listen(config.get('port'), () => {
    Logger.log(
      `Listening at port: ${config.get(
        'port',
      )} and running at ${config.get('environment')} mode`,
    );
  });
}
bootstrap();
