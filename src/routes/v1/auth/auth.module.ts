import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import UsersModule from '@v1/users/users.module';
import { ConfigModule } from '@nestjs/config';
import AuthRepository from './auth.repository';
import LocalStrategy from './strategies/local.strategy';
import JwtAccessStrategy from './strategies/jwt-access.strategy';
import JwtRefreshStrategy from './strategies/jwt-refresh.strategy';

import AuthController from './auth.controller';
import AuthService from './auth.service';
import JwtWSAccessStrategy from './strategies/jwt-ws-access.strategy';
import GlobalJwtModule from './jwt.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    GlobalJwtModule,
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtWSAccessStrategy,
    AuthRepository,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export default class AuthModule {}
