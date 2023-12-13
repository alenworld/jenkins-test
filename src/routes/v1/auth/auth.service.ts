import * as bcrypt from 'bcrypt';
import {
  ForbiddenException, Injectable, NotFoundException, UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import UsersService from '@v1/users/users.service';
import UserResponseDto from '@v1/users/dto/responses/user-response.dto';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'typeorm';
import { InjectConnection } from '@nestjs/typeorm';
import RedisKeys from '@common/services/redis-key.service';
import SignInResponseDto from './dto/responses/sign-in.dto';

import AuthRepository from './auth.repository';
import { DecodedUser, RefreshPayload } from './interfaces/decoded-user.interface';
import SignUpDto from './dto/requests/sign-up.dto';
import ResetPasswordDto from './dto/requests/reset-password.dto';

@Injectable()
export default class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authRepository: AuthRepository,
    private readonly configService: ConfigService,
    @InjectConnection()
    private readonly connection: Connection,
  ) { }

  public async signUp(data: SignUpDto) {
    const result = await this.usersService.create(data);

    return this.signIn(result);
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<null | DecodedUser> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user) throw new UnauthorizedException();

    if (!user.roles) throw new NotFoundException('ROLE');

    const passwordCompared = await bcrypt.compare(password, user.password);

    if (passwordCompared) {
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        roles: user.roles,
        type: user.type,
        lang: user.language,
      };
    }

    return null;
  }

  async signIn(data: DecodedUser): Promise<SignInResponseDto> {
    const payload: DecodedUser = {
      id: data.id,
      email: data.email,
      username: data.username,
      roles: data.roles,
      type: data.type,
      lang: data.lang,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.accessExpirationTime'),
      secret: this.configService.get('jwt.accessToken'),
    });
    const refreshToken = this.jwtService.sign({ id: data.id, email: data.email }, {
      expiresIn: this.configService.get('jwt.refreshExpirationTime'),
      secret: this.configService.get('jwt.refreshToken'),
    });

    await this.authRepository.setToken(
      RedisKeys.refreshToken(payload.email),
      refreshToken,
      this.configService.get('jwt.refreshExpirationRedis') ?? 60,
    );

    const user: UserResponseDto | undefined = await this.usersService.getById(data.id);

    if (!user) throw new NotFoundException('USER');

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(token: string) {
    const payload = this.jwtService.decode(token) as RefreshPayload;

    if (!payload.email) throw new ForbiddenException('INCORRECT_EMAIL');

    const oldRefreshToken = await this.authRepository.getToken(RedisKeys.refreshToken(payload.email));
    const user = await this.usersService.getUserByEmail(payload.email);

    if (!oldRefreshToken || oldRefreshToken !== token || !user) throw new ForbiddenException('INCORRECT_TOKEN');

    return this.signIn(user);
  }

  async verifyUser(token: string) {
    const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get('jwt.refreshToken') });

    if (!payload?.id) throw new ForbiddenException('INVALID_TOKEN');

    const storedToken = await this.authRepository.getToken(RedisKeys.verificationToken(payload.id));

    if (token !== storedToken) throw new ForbiddenException('INVALID_TOKEN');

    await this.usersService.update(
      payload.id,
      { isVerified: true },
    );

    return { verified: true };
  }

  deleteTokenByEmail(email: string): Promise<number> {
    return this.authRepository.removeToken(RedisKeys.refreshToken(email));
  }

  getCurrentUser(token: DecodedUser) {
    return this.usersService.getById(token.id);
  }

  async resetPassword(data: ResetPasswordDto) {
    const { userId } = this.jwtService.verify(data.token);

    const user = await this.usersService.getById(userId);

    if (!user) throw new NotFoundException('USER');

    const token = await this.authRepository.getToken(RedisKeys.passwordResetToken(userId));

    if (!token || token !== data.token) {
      throw new ForbiddenException();
    }

    const password = await bcrypt.hash(data.password, 14);

    await this.usersService.update(userId, { password });

    // to prevent re-use of token
    await this.authRepository.removeToken(RedisKeys.passwordResetToken(user.id));

    return { message: 'Password updated' };
  }
}
