import {
  Body,
  Controller,
  HttpCode,
  Post,
  UseGuards,
  HttpStatus,
  UseInterceptors,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBody,
  ApiOkResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiNoContentResponse,
} from '@nestjs/swagger';

import UserResponseDto from '@v1/users/dto/responses/user-response.dto';
import ApiResponses, { ApiSchema } from '@common/docs/swagger.tools';
import WrapResponseInterceptor from '@common/interceptors/wrap-response.interceptor';
import User from '@common/decorators/request-user.decorator';
import Serialize from '@common/decorators/serialization.decorator';
import JwtAccessGuard from '@common/guards/jwt-access.guard';
import { DecodedUser } from './interfaces/decoded-user.interface';
import LocalAuthGuard from './guards/local-auth.guard';
import AuthService from './auth.service';
import RefreshTokenDto from './dto/requests/refresh-token.dto';
import SignInDto from './dto/requests/sign-in.dto';
import SignInResponseDto from './dto/responses/sign-in.dto';
import SignUpDto from './dto/requests/sign-up.dto';
import VerifyEmailDto from './dto/requests/verify-email.dto';
import ResetPasswordDto from './dto/requests/reset-password.dto';

@ApiTags('Auth')
@UseInterceptors(WrapResponseInterceptor)
@ApiExtraModels(SignInResponseDto, UserResponseDto)
@ApiResponses()
@Controller()
export default class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) { }

  @ApiBody({ type: SignInDto })
  @ApiOkResponse({
    schema: ApiSchema(SignInResponseDto),
    description: 'Returns user profile data',
  })
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Serialize(SignInResponseDto)
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@User() user: DecodedUser): Promise<SignInResponseDto> {
    return this.authService.signIn(user);
  }

  @ApiOkResponse({
    description: 'User verified',
  })
  @Get('verify-email')
  async verifyUser(@Query() { token }: VerifyEmailDto) {
    return this.authService.verifyUser(token);
  }

  @ApiOkResponse({
    schema: ApiSchema(SignInResponseDto),
    description: 'Returns user profile data',
  })
  @UsePipes(ValidationPipe)
  @HttpCode(HttpStatus.OK)
  @Serialize(SignInResponseDto)
  @Post('sign-up')
  async signUp(
    @Body() data: SignUpDto,
  ) {
    return this.authService.signUp(data);
  }

  @ApiNoContentResponse({
    description: 'Logged out',
  })
  @ApiBearerAuth()
  @UseGuards(JwtAccessGuard)
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@User() { email }: DecodedUser) {
    await this.authService.deleteTokenByEmail(email);
    return {};
  }

  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({
    schema: ApiSchema(SignInResponseDto),
    description: '200. returned jwt tokens',
  })
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @Post('refresh-token')
  async refreshToken(
    @Body() refreshTokenDto: RefreshTokenDto,
  ): Promise<SignInResponseDto | never> {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }

  @ApiOkResponse({
    schema: ApiSchema(UserResponseDto),
  })
  @ApiBearerAuth()
  @Serialize(UserResponseDto)
  @UseGuards(JwtAccessGuard)
  @Get('current-user')
  async getCurrentUser(@User() user: DecodedUser) {
    return this.authService.getCurrentUser(user);
  }

  @ApiOkResponse({
    description: 'Reset password using token from email',
  })
  @Post('reset-password')
  async resetPassword(@Body() data: ResetPasswordDto) {
    return this.authService.resetPassword(data);
  }
}
