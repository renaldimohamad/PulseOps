import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceEvents } from '../events/service.events';

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    return this.prisma.alert.findMany({
      include: { service: true },
    });
  }

  async create(data: any) {
    return this.prisma.alert.create({
      data,
    });
  }

  async update(id: string, data: any) {
    return this.prisma.alert.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.alert.delete({
      where: { id },
    });
  }

  async evaluateThresholds(serviceId: string, latency: number, status: string) {
    const alerts = await this.prisma.alert.findMany({
      where: {
        serviceId,
        isActive: true,
      },
    });

    for (const alert of alerts) {
      let triggered = false;
      let value = 0;

      if (alert.type === 'LATENCY_THRESHOLD' && alert.threshold && latency > alert.threshold) {
        triggered = true;
        value = latency;
        this.logger.warn(`Alert triggered: Latency ${latency}ms exceeds threshold ${alert.threshold}ms for service ${serviceId}`);
      }
      
      if (alert.type === 'STATUS_DOWN' && status === 'DOWN') {
        triggered = true;
        this.logger.error(`Alert triggered: Service ${serviceId} is DOWN`);
      }

      if (triggered) {
        this.eventEmitter.emit(ServiceEvents.ALERT_TRIGGERED, {
          alert,
          value,
          timestamp: new Date(),
        });
      }
    }
  }
}
