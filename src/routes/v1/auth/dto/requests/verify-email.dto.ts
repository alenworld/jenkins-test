import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsNotEmpty } from 'class-validator';

export default class VerifyEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsJWT()
  token!: string;
}
