import LanguageEnum from '@common/enums/language.enum';
import RolesEnum from '@common/enums/roles.enum';
import UserTypesEnum from '@common/enums/user-types.enum';

export interface DecodedUser {
  readonly id: string;
  readonly email: string;
  readonly username: string;
  readonly roles: RolesEnum[];
  readonly type: UserTypesEnum;
  readonly iat?: number;
  readonly exp?: number;
  readonly lang?: LanguageEnum;
}

export interface RefreshPayload {
  readonly id: string;
  readonly email: string;
}
