import { ApiProperty } from '@nestjs/swagger';

export default class GetVersionDto {
  @ApiProperty()
  version!: string;

  @ApiProperty()
  releaseDate!: string;

  @ApiProperty()
  uptime!: number;
}
