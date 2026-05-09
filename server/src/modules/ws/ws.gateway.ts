import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceEvents } from '../events/service.events';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all for dev, or specify http://localhost:3000
  },
})
export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WsGateway.name);

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @OnEvent(ServiceEvents.CREATED)
  handleServiceCreated(payload: any) {
    this.server.emit('service.created', payload);
  }

  @OnEvent(ServiceEvents.UPDATED)
  handleServiceUpdated(payload: any) {
    this.server.emit('service.updated', payload);
  }

  @OnEvent(ServiceEvents.DELETED)
  handleServiceDeleted(payload: any) {
    this.server.emit('service.deleted', { id: payload.id });
  }

  @OnEvent(ServiceEvents.STATUS_CHANGED)
  handleStatusChanged(payload: any) {
    this.server.emit('service.updated', payload);
  }
}
