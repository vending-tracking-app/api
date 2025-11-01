import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { bodyParserMiddleware } from './utils/body-parser.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(bodyParserMiddleware);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.getOrThrow<string>('FRONTEND_URL'),
    credentials: true,
  });

  const port = parseInt(configService.getOrThrow('PORT'));
  await app.listen(port);
}

void bootstrap();
