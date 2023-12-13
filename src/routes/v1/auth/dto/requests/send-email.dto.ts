import { TransformToLowercase } from '@common/functions/transforms';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export default class SendEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @Transform(TransformToLowercase)
  email!: string;
}
