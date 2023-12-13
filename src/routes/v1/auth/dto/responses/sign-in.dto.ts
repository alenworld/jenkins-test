import { ApiProperty } from '@nestjs/swagger';
import UserResponseDto from '@v1/users/dto/responses/user-response.dto';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export default class SignInResponseDto {
  @ApiProperty({ type: String })
  readonly accessToken: string = '';

  @ApiProperty({ type: String })
  readonly refreshToken: string = '';

  @ApiProperty({ type: UserResponseDto })
  @ValidateNested()
  @Type(() => UserResponseDto)
  user!: UserResponseDto | undefined;
}
