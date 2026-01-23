import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { bodyParserMiddleware } from './utils/body-parser.middleware';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.use(bodyParserMiddleware);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('frontendUrl'),
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  const config = new DocumentBuilder().build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  const port = configService.get('env.port');
  await app.listen(port);
}

void bootstrap();
