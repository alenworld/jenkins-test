import { ApiTags } from '@nestjs/swagger';
import AuthWsUser from '@decorators/ws-user-auth.decorator';
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  Logger,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Socket, Namespace } from 'socket.io';
import { DecodedUser } from '@v1/auth/interfaces/decoded-user.interface';
import JwtWSAccessGuard from '@guards/jwt-ws-access.guard';
import SocketEvent from '@common/services/sockets/socket.types';
import SocketService from '@common/services/sockets/socket.service';
import SocketRoomsService from '@common/services/sockets/socket-rooms.service';

@ApiTags('Sockets')
@WebSocketGateway({ namespace: '/api/v1', cors: { origin: '*' } })
@UseGuards(JwtWSAccessGuard)
@UsePipes(new ValidationPipe({
  transform: true,
  whitelist: true,
  forbidNonWhitelisted: true,
  forbidUnknownValues: true,
}))

/**
 * @api {event} / Connection to sockets
 * @apiVersion 1.0.0
 * @apiGroup Socket-Api
 * @apiDescription Connection to sockets
 * @apiParam {String} auth token Authorization token
 * @apiSampleRequest off
 */

/**
 *
 * @api {emit} /errors
 * @apiVersion 1.0.0
 * @apiGroup Socket-Api
 * @apiDescription Error message
 * @apiError 2001 Message id is required
 * @apiSampleRequest off
 */

export default class AppGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io!: Namespace;

  constructor(
    private readonly socketService: SocketService,
  ) {}

  private readonly logger = new Logger('sockets');

  afterInit(): any {
    this.logger.log('Websocket Gateway initialized');
  }

  async handleConnection(client: Socket): Promise<void> {
    const { sockets } = this.io;

    const user = await this.socketService.authUserSocket(client);

    if (!user) return;

    client.join(SocketRoomsService.user(user.id));
    this.logger.log(`WS Client with id: ${client.id}  connected!`);
    this.logger.debug(`Number of connected sockets ${sockets.size}`);
  }

  /**
   * @api {event} /ping SendMessage
   * @apiVersion 1.0.0
   * @apiGroup Message-Socket
   * @apiDescription Send message
   * @apiParam {string} message string
   * @apiParam {uuid} id uuid
   * @apiSampleRequest off
   */
  @SubscribeMessage<SocketEvent>('ping')
  handleMessage(
    @AuthWsUser() user: DecodedUser,
    @MessageBody() data: { message: string; id: string },
    @ConnectedSocket() socket: Socket,
  ): void {
    socket.emit('pong', {
      message: 'test message from server',
      clientMessage: data,
      user,
    });
  }

  handleDisconnect(client: Socket): any {
    const { sockets } = this.io;

    this.socketService.getAuthUser(client).then((user) => {
      this.socketService.deleteSocketId(user?.id ?? '');
    }).catch((e) => {
      this.logger.error(e);
    });

    this.logger.log(`WS Client with id: ${client.id} disconnected!`);
    this.logger.debug(`Number of connected sockets ${sockets.size}`);
  }
}
