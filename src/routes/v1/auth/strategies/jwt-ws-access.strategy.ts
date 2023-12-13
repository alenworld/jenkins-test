import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DecodedUser } from '../interfaces/decoded-user.interface';

@Injectable()
export default class JwtWSAccessStrategy extends PassportStrategy(Strategy, 'accessTokenWS') {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (client: any) => {
          const bearerToken = client?.handshake?.auth?.token ?? client?.handshake?.headers?.authorization;
          return bearerToken ? bearerToken.split(' ')[1] : null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('jwt.accessToken'),
    });
  }

  async validate(payload: DecodedUser): Promise<DecodedUser> {
    return payload;
  }
}
