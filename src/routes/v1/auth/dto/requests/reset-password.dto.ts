import IsPassword from '@decorators/validation/is-password.decorator';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty, IsString,
} from 'class-validator';

export default class ResetPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  token!: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsPassword()
  password!: string;
}
