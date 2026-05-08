import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ServiceEvents } from '../events/service.events';
import { firstValueFrom } from 'rxjs';
import { WsGateway } from '../ws/ws.gateway';

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private eventEmitter: EventEmitter2,
    private wsGateway: WsGateway,
  ) {}

  async checkAllServices() {
    this.logger.log('Starting health check for all services...');
    const services = await this.prisma.service.findMany();

    for (const service of services) {
      await this.checkService(service);
    }
    this.logger.log('Health check completed.');
  }

  private async checkService(service: any) {
    const startTime = Date.now();
    let status: ServiceStatus = ServiceStatus.DOWN;
    let latency = 0;
    let rawStatus: number | null = null;
    let lastError: string | null = null;

    try {
      const response = await firstValueFrom(
        this.httpService.get(service.url, { timeout: 5000 }),
      );

      latency = Date.now() - startTime;
      rawStatus = response.status;
      
      // Strict binary contract: 200-399 is UP
      status = rawStatus >= 200 && rawStatus < 400 
        ? ServiceStatus.UP 
        : ServiceStatus.DOWN;
        
      if (status === ServiceStatus.DOWN) {
        lastError = `Unhealthy status code: ${rawStatus}`;
      }
    } catch (error) {
      latency = Date.now() - startTime;
      status = ServiceStatus.DOWN;
      rawStatus = error.response?.status || null;
      lastError = error.message;
      this.logger.warn(`Service ${service.name} (${service.url}) is DOWN: ${lastError}`);
    }

    // Update DB if state changed (or always for observability updates like latency/rawStatus)
    // To strictly follow "only on change", I will check if status OR rawStatus changed.
    if (service.status !== status || service.rawStatus !== rawStatus) {
      const updatedService = await this.prisma.service.update({
        where: { id: service.id },
        data: {
          status,
          latency,
          rawStatus,
          lastError,
          lastChecked: new Date(),
        },
      });

      console.log(`[HealthCheck] Service ${service.name} => ${status} (${rawStatus})`);
      this.wsGateway.emitServiceUpdate(updatedService);
      this.eventEmitter.emit(ServiceEvents.STATUS_CHANGED, updatedService);
      this.logger.log(`Service ${service.name} status updated to ${status}`);
    } else {
      this.logger.debug(`Service ${service.name} state unchanged, skipping update.`);
    }
  }
}
