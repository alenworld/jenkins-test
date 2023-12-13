import {
  CanActivate, ExecutionContext, Injectable, UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtDecodeResponse } from '@interfaces/jwt-decode-response.interface';

@Injectable()
export default class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) return true;

    const request: Request = context.switchToHttp().getRequest();
    const tokenData = this.jwtService
      .decode(request.headers.authorization?.split('Bearer')[1].trim() as string) as JwtDecodeResponse | null;

    if (!tokenData) {
      throw new UnauthorizedException();
    }

    return roles.some((role) => tokenData?.roles.includes(role));
  }
}
