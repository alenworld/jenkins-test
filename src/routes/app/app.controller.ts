import { ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import {
  Controller, Get, Res,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'node:fs';
import { join } from 'node:path';
import AppService from './app.service';
import GetVersionDto from './dto/get-version.dto';

@Controller('api')
export default class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({
    type: GetVersionDto,
    description: 'Returns version api',
  })
  @Get('version')
  getVersion(): GetVersionDto {
    return this.appService.getVersion();
  }

  @Get('socket-docs')
  getSocketDocs(
    @Res() res: Response,
  ): any {
    if (process.env.NODE_ENV === 'production') {
      res.send(this.appService.getVersion());
    }
    const filePath = join(__dirname, '../../../docs/index.html');

    if (existsSync(filePath)) {
      const file = createReadStream(filePath);

      file.pipe(res);
    } else {
      res.send(this.appService.getVersion());
    }
  }
}
