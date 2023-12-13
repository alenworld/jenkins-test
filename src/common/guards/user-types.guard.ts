import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { DecodedUser } from '@v1/auth/interfaces/decoded-user.interface';
import { Request } from 'express';

@Injectable()
export default class UserTypesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const types = this.reflector.get<string[]>('user_types', context.getHandler());

    if (!types) return true;

    const request: Request = context.switchToHttp().getRequest();

    const tokenData = this.jwtService
      .decode(request.headers.authorization?.split('Bearer')[1].trim() as string) as DecodedUser | null;

    if (!tokenData) {
      throw new UnauthorizedException();
    }

    return types.includes(tokenData.type);
  }
}
