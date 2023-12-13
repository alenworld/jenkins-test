import { TransformToLowercase } from '@common/functions/transforms';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export default class SignInDto {
  constructor(body: SignInDto | null = null) {
    if (body) {
      this.email = body.email.toLowerCase();
      this.password = body.password;
    }
  }

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @Transform(TransformToLowercase)
  @MinLength(3)
  @MaxLength(128)
  readonly email: string = '';

  @ApiProperty({ type: String })
  @IsNotEmpty()
  @IsString()
  @Length(8)
  readonly password: string = '';
}
