import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ServiceEvents } from '../events/service.events';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private eventEmitter: EventEmitter2,
  ) {}

  async checkAllServices() {
    this.logger.log('Starting health check for all services...');
    const services = await this.prisma.service.findMany();

    // Parallel health check using Promise.all to avoid sequential delays
    await Promise.all(services.map((service) => this.checkService(service)));
    
    this.logger.log('Health check completed.');
  }

  private async checkService(service: any) {
    const startTime = performance.now();
    let status: ServiceStatus = ServiceStatus.DOWN;
    let latency = 0;
    let rawStatus: number | null = null;
    let lastError: string | null = null;

    try {
      const response = await firstValueFrom(
        this.httpService.get(service.url, { 
          timeout: 10000, // Increased timeout to 10s
          validateStatus: () => true // Handle all status codes manually
        }),
      );

      // Measure latency only for the actual network request
      latency = Math.round(performance.now() - startTime);
      rawStatus = response.status;
      
      // Better status detection mapping
      if (rawStatus >= 200 && rawStatus < 400) {
        status = ServiceStatus.UP;
      } else if (rawStatus === 401 || rawStatus === 403) {
        status = ServiceStatus.PROTECTED;
      } else if (rawStatus === 404) {
        status = ServiceStatus.DEGRADED;
      } else if (rawStatus >= 500) {
        status = ServiceStatus.DOWN;
      } else {
        status = ServiceStatus.DOWN;
      }
        
      if (status === ServiceStatus.DOWN) {
        lastError = `Unhealthy status code: ${rawStatus}`;
      }
    } catch (error: any) {
      latency = Math.round(performance.now() - startTime);
      status = ServiceStatus.DOWN;
      rawStatus = error.response?.status || null;
      
      // Map specific network errors
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        lastError = 'Connection Timeout';
      } else if (error.code === 'ENOTFOUND') {
        lastError = 'DNS Failure';
      } else if (error.code === 'ECONNREFUSED') {
        lastError = 'Connection Refused';
      } else {
        lastError = error.message;
      }
      
      this.logger.warn(`Service ${service.name} (${service.url}) is DOWN: ${lastError}`);
    }

    // Always update DB to ensure realtime latency/lastChecked observability
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

    // Notify clients via WebSocket
    this.eventEmitter.emit(ServiceEvents.STATUS_CHANGED, updatedService);
    
    if (service.status !== status) {
      this.logger.log(`Service ${service.name} status transition: ${service.status} -> ${status}`);
    }
  }
}
