import { SetMetadata } from '@nestjs/common';
import RolesEnum from '../enums/roles.enum';

const Roles = (...roles: RolesEnum[]) => SetMetadata('roles', roles);

export default Roles;
