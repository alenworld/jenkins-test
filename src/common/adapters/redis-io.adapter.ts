import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from 'socket.io-redis';
import Redis from 'ioredis';
import { ServerOptions } from 'socket.io';

export default class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: ServerOptions): any {
    const pubClient = new Redis(Number(process.env.REDIS_PORT), process.env.REDIS_HOST);
    const subClient = pubClient.duplicate();
    const redisAdapter = createAdapter({ pubClient, subClient });
    const server = super.createIOServer(port, options);

    server.adapter(redisAdapter);

    return server;
  }
}
