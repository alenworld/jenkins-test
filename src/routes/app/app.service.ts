import { Injectable } from '@nestjs/common';
import GetVersionDto from './dto/get-version.dto';
import * as packageConfig from '../../../package.json';

@Injectable()
export default class AppService {
  getVersion(): GetVersionDto {
    return {
      version: packageConfig.version,
      releaseDate: process.env.RELEASE_DATE || 'RELEASE_DATE not found',
      uptime: process.uptime(),
    };
  }
}
