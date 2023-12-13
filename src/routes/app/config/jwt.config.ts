import transformEnvValidationErrors from '@common/functions/validation.errors';
import {
  IsNotEmpty, validate,
} from 'class-validator';

export class JwtVariables {
  @IsNotEmpty()
  accessToken!: string;

  @IsNotEmpty()
  refreshToken!: string;

  @IsNotEmpty()
  secret!: string;

  @IsNotEmpty()
  accessExpirationTime!: string;

  @IsNotEmpty()
  refreshExpirationTime!: string;

  @IsNotEmpty()
  refreshExpirationRedis!: number;
}

const loadJwtVariables = async () => {
  const obj = Object.assign(new JwtVariables(), {
    accessToken: process.env.ACCESS_TOKEN,
    refreshToken: process.env.REFRESH_TOKEN,
    secret: process.env.JWT_SECRET,
    accessExpirationTime: process.env.EXPIRATION_JWT_ACCESS,
    refreshExpirationTime: process.env.EXPIRATION_JWT_REFRESH,
    refreshExpirationRedis: Number(process.env.EXPIRATION_JWT_REFRESH_REDIS),
  });

  const errors = await validate(obj);

  if (errors.length > 0) throw transformEnvValidationErrors(errors, 'jwt');

  return { jwt: obj };
};

export default loadJwtVariables;
