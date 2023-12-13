import transformEnvValidationErrors from '@common/functions/validation.errors';
import {
  IsDefined, IsNumber, IsString, validate,
} from 'class-validator';

class RedisVariables {
  @IsDefined()
  @IsString()
  host!: string;

  @IsDefined()
  @IsNumber()
  port!: number;
}

const loadRedisVariables = async () => {
  const redis = Object.assign(new RedisVariables(), {
    host: process.env.REDIS_HOST || 'redis',
    port: (process.env.REDIS_PORT as unknown) as number,
  });

  const errors = await validate(redis);

  if (errors.length > 0) throw transformEnvValidationErrors(errors, 'redis');

  return { redis };
};

export default loadRedisVariables;
