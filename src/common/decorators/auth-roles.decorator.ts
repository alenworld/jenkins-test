import {
  applyDecorators, CanActivate, SetMetadata, UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import RolesEnum from '../enums/roles.enum';
import RolesGuard from '../guards/roles.guard';

export default function AuthWithRole(authGuard: Function | CanActivate, roles: RolesEnum[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(authGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    ApiForbiddenResponse({ description: 'Forbidden' }),
  );
}
