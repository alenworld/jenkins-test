import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import AppGateway from '@app/app.gateway';
import SocketService from '@common/services/sockets/socket.service';
import { JwtModule } from '@nestjs/jwt';
import V1Module from '../v1/v1.module';

import AppService from './app.service';
import AppController from './app.controller';
import loadEnv from './config/app.config';
import PagesModule from '../pages/pages.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [loadEnv],
    }),
    TypeOrmModule.forRoot(),
    RedisModule.forRoot({
      closeClient: true,
      config: {
        host: process.env.REDIS_HOST || 'redis',
        port: (process.env.REDIS_PORT as unknown) as number,
      },
    }),
    V1Module,
    PagesModule,
    JwtModule.registerAsync({
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway, SocketService],
  exports: [AppGateway],
})
export default class AppModule {}
