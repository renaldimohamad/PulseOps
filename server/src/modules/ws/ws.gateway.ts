import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { forwardRef, Inject, Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { ServiceEvents } from '../events/service.events';
import { AnalyticsService } from '../analytics/analytics.service';

@WebSocketGateway({
  cors: {
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'https://pulseops.renaldi.fun',
      'https://pulseops.renaldi.fun/'
    ],
    methods: ['GET', 'POST'],
    credentials: true,
  },
})

export class WsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(WsGateway.name);

  constructor(
    @Inject(forwardRef(() => AnalyticsService))
    private readonly analyticsService: AnalyticsService,
  ) {}

  afterInit() {
    this.logger.log('PulseOps WebSocket Hub Initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client attached: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client detached: ${client.id}`);
  }

  @OnEvent('analytics.refresh')
  async handleAnalyticsRefresh() {
    this.logger.log('Fleet update detected. Broadcasting fresh analytics overview...');
    const overview = await this.analyticsService.getOverview();
    this.server.emit('analytics.updated', overview);
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

  @OnEvent(ServiceEvents.INCIDENT_CREATED)
  handleIncidentCreated(payload: any) {
    this.server.emit('incident.created', payload);
  }

  @OnEvent(ServiceEvents.INCIDENT_RESOLVED)
  handleIncidentResolved(payload: any) {
    this.server.emit('incident.resolved', payload);
  }

  @OnEvent(ServiceEvents.ALERT_TRIGGERED)
  handleAlertTriggered(payload: any) {
    this.server.emit('alert.triggered', payload);
  }
}
