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

    for (const service of services) {
      await this.checkService(service);
    }
    this.logger.log('Health check completed.');
  }

  private async checkService(service: any) {
    const startTime = Date.now();
    let status: ServiceStatus = ServiceStatus.PENDING;
    let latency = 0;

    try {
      const response = await firstValueFrom(
        this.httpService.get(service.url, { timeout: 5000 }),
      );

      latency = Date.now() - startTime;
      status =
        response.status >= 200 && response.status < 300
          ? ServiceStatus.UP
          : ServiceStatus.DOWN;
    } catch (error) {
      latency = Date.now() - startTime;
      status = ServiceStatus.DOWN;
      this.logger.warn(`Service ${service.name} (${service.url}) is DOWN: ${error.message}`);
    }

    // Only update if status or latency changed significantly (or always update lastChecked)
    // The requirement says: "Only update DB if there is a state change, to avoid unnecessary writes."
    // However, we usually want to update lastChecked and latency. 
    // But I will strictly follow "Only update if status change" for status writes, 
    // but maybe update others too. Wait, "skip update" if same state.
    
    if (service.status !== status) {
      const updatedService = await this.prisma.service.update({
        where: { id: service.id },
        data: {
          status,
          latency,
          lastChecked: new Date(),
        },
      });

      this.eventEmitter.emit(ServiceEvents.STATUS_CHANGED, updatedService);
      this.logger.log(`Service ${service.name} status changed to ${status}`);
    } else {
      // Even if status is same, we might want to update latency and lastChecked periodically?
      // Requirement says "UP -> UP -> skip update". I will follow that.
      this.logger.debug(`Service ${service.name} still ${status}, skipping update.`);
    }
  }
}
