import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import UserResponseDto from './user-response.dto';

export default class AllUsersResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  @ValidateNested({ each: true })
  @Type(() => UserResponseDto)
  users: UserResponseDto[] = []
}
