import * as Redis from 'ioredis';

import { Injectable } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import { promisify } from 'util';

@Injectable()
export default class AuthRepository {
  private readonly redisClient: Redis.Redis;

  private readonly redisTTL: (key: string) => Promise<number>;

  constructor(
    private readonly redisService: RedisService,
  ) {
    this.redisClient = redisService.getClient();

    this.redisTTL = promisify(this.redisClient.ttl).bind(this.redisClient) as (key: string) => Promise<number>;
  }

  public async setToken(key: string, token: string, expiration: number): Promise<void> {
    await this.redisClient.set(
      key,
      token,
      'EX',
      expiration,
    );
  }

  public getToken(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  public removeToken(key: string): Promise<number> {
    return this.redisClient.del(key);
  }

  public getTTL(key: string) {
    return this.redisTTL(key);
  }
}
