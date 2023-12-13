import { ApiProperty } from '@nestjs/swagger';

export default class NextTimeoutDto {
  @ApiProperty()
  timeout!: number;
}
