import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import RolesEnum from '@common/enums/roles.enum';
import UserTypesEnum from '@common/enums/user-types.enum';
import LanguageEnum from '@common/enums/language.enum';

export default class UserResponseDto {
  @ApiProperty({ type: String })
  readonly id!: string;

  @ApiProperty({ type: String })
  readonly email!: string;

  @ApiProperty({ type: String })
  readonly username!: string;

  @Exclude()
  readonly password?: string;

  @ApiProperty({ type: String })
  readonly phone!: string;

  @ApiProperty({ type: String })
  readonly firstName!: string;

  @ApiProperty({ type: String })
  readonly lastName!: string;

  @ApiProperty({ type: Boolean })
  readonly isVerified!: boolean;

  @ApiProperty({ enum: RolesEnum, isArray: true })
  readonly roles!: RolesEnum[];

  @ApiProperty({ enum: UserTypesEnum })
  type!: UserTypesEnum;

  @ApiPropertyOptional({ enum: LanguageEnum })
  language?: LanguageEnum;

  @ApiProperty()
  public createdAt!: Date;

  @ApiProperty()
  public updatedAt!: Date;
}

export type IUserResponseDto = Omit<UserResponseDto, 'password'>;
