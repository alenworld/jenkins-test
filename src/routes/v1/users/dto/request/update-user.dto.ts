import LanguageEnum from '@common/enums/language.enum';
import { ApiPropertyOptional } from '@nestjs/swagger';
import UserEntity from '@v1/users/entities/user.entity';
import {
  IsOptional, IsString, IsEnum,
} from 'class-validator';

export default class UpdateUserDto implements Partial<UserEntity> {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @IsEnum(LanguageEnum)
  language?: LanguageEnum;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  phone?: string;
}
