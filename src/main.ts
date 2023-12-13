// registers aliases, DON'T REMOVE THIS LINE!
import 'module-alias/register';

import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

import { JwtService } from '@nestjs/jwt';
import UserTypesGuard from '@guards/user-types.guard';

import RolesGuard from '@guards/roles.guard';
import RedisIoAdapter from '@common/adapters/redis-io.adapter';
import AllExceptionsFilter from './common/filters/all-exceptions.filter';
import AppModule from './routes/app/app.module';
import * as packageConfig from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new AllExceptionsFilter());

  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new RolesGuard(new Reflector(), jwtService), new UserTypesGuard(new Reflector(), jwtService));
  app.useWebSocketAdapter(new RedisIoAdapter(app));
  app.useStaticAssets(join(__dirname, '../../src/routes/pages', '/assets'));
  app.setBaseViewsDir(join(__dirname, '../../src/routes/pages', '/views'));
  app.setViewEngine('ejs');

  app.enableCors({ origin: '*' });

  const port = process.env.SERVER_PORT || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const options = new DocumentBuilder()
      .setTitle('Api v1')
      .setDescription('API')
      .setVersion(packageConfig.version)
      .addBearerAuth({ in: 'header', type: 'http' })
      .build();

    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(
      'docs',
      app,
      document,
      {
        swaggerOptions: {
          persistAuthorization: true,
          docExpansion: 'none',
        },
      },
    );
  }

  await app.listen(port, async () => {
    console.log(`The server is running on ${port} port: http://localhost:${port}/docs`);
  });
}

bootstrap();
