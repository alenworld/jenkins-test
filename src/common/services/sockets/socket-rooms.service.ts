import { SocketRoom } from '@common/services/sockets/socket.types';

export default class SocketRoomsService {
  static user(userId: string): SocketRoom {
    return `user-${userId}`;
  }

  static file(fileId: string): SocketRoom {
    return `file-${fileId}`;
  }
}
