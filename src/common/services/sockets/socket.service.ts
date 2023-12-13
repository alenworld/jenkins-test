import { Injectable } from '@nestjs/common';
import * as Redis from 'ioredis';
import { RedisService } from '@liaoliaots/nestjs-redis';
import IORedis from 'ioredis';
import { Namespace, Socket } from 'socket.io';
import { DecodedUser } from '@v1/auth/interfaces/decoded-user.interface';
import { JwtService } from '@nestjs/jwt';
import { SocketEmitEvent, SocketRoom } from './socket.types';
import RedisKeys from '../redis-key.service';

@Injectable()
export default class SocketService {
  private readonly redisClient: Redis.Redis;

  constructor(
    private readonly redisService: RedisService,
    private readonly jwtService: JwtService,
  ) {
    this.redisClient = redisService.getClient();
  }

  public addSocketId(userId: string, socketId: string): Promise<IORedis.Ok | null> {
    return this.redisClient.set(
      RedisKeys.userSocketId(userId),
      socketId,
      'EX',
      60 * 60 * 24, // 1d
    );
  }

  public async getSocketId(userId: string): Promise<string | null> {
    return this.redisClient.get(RedisKeys.userSocketId(userId));
  }

  public deleteSocketId(userId: string) {
    return this.redisClient.del(RedisKeys.userSocketId(userId));
  }

  public async getAuthUser(client: Socket): Promise<DecodedUser | null> {
    try {
      const bearerToken = client?.handshake?.auth?.token ?? client?.handshake?.headers?.authorization;
      const token = bearerToken ? bearerToken.split(' ')[1] : null;
      const user = this.jwtService.decode(token) as DecodedUser;

      return user;
    } catch (e) {
      return null;
    }
  }

  public async authUserSocket(client: Socket) {
    const user = await this.getAuthUser(client);

    if (!user) {
      client.disconnect(true);
      return null;
    }

    const registered = await this.addSocketId(user.id, client.id);

    if (!registered) {
      client.disconnect(true);
      return null;
    }

    return user;
  }

  public async emit(io: Namespace, room: SocketRoom | SocketRoom[], event: SocketEmitEvent, data: any) {
    io.to(room).emit(event, data);
  }

  public async subscribe(io: Namespace, room: SocketRoom | SocketRoom[], userId: string) {
    const socketId = await this.getSocketId(userId);

    if (!socketId) return false;

    const socket = io.sockets.get(socketId);

    if (!socket) return false;

    socket.join(room);
    socket.emit('subscribed', { room });

    return true;
  }

  public async unsubscribe(io: Namespace, room: SocketRoom, userId: string) {
    const socketId = await this.getSocketId(userId);

    if (!socketId) return false;

    const socket = io.sockets.get(socketId);

    if (!socket) return false;

    socket.leave(room);
    socket.emit('unsubscribed', { room });

    return true;
  }
}
