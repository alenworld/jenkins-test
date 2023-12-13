import {
  Controller,
  Get,
  Render,
  Post,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller()
export default class PagesController {
  @Get()
  @Render('home')
  home() {
    return { message: 'Hello, world!' };
  }

  @Get('/sign-up')
  @Render('sign-up')
  pageSignUp() {}

  @Get('/sign-in')
  @Render('sign-in')
  pageSignIn() {}

  @Get('/forgot-password')
  @Render('forgot-password')
  pageForgotPassword() {}

  @Post('/sign-in')
  @Render('sign-in')
  signIn() {
    return {};
  }

  @Post('/sign-up')
  @Render('sign-up')
  signUp() {
    return {};
  }
}
