import { Module } from '@nestjs/common';
import PagesController from './pages.controller';

@Module({
  imports: [],
  controllers: [PagesController],
  providers: [],
  exports: [],
})
export default class PagesModule { }
