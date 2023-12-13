import UserTypesEnum from '@common/enums/user-types.enum';
import { SetMetadata } from '@nestjs/common';

const UserTypes = (...types: UserTypesEnum[]) => SetMetadata('user_types', types);

export default UserTypes;
