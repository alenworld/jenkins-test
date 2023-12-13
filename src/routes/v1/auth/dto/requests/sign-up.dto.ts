import LanguageEnum from '@common/enums/language.enum';
import { TransformToLowercase } from '@common/functions/transforms';
import IsPassword from '@decorators/validation/is-password.decorator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches,
} from 'class-validator';

export default class SignUpDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 64)
  firstName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Length(2, 64)
  lastName!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(TransformToLowercase)
  email!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPassword()
  password!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @Matches(/\+[\d]{7,15}/)
  phone!: string;

  @ApiProperty()
  @IsNotEmpty()
  @Transform(TransformToLowercase)
  username!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  language!: LanguageEnum;
}
