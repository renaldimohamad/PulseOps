import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ServiceEvents } from '../events/service.events';

@Injectable()
export class IncidentsService {
  private readonly logger = new Logger(IncidentsService.name);

  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async findAll() {
    return this.prisma.incident.findMany({
      include: { service: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findActive() {
    return this.prisma.incident.findMany({
      where: { resolvedAt: null },
      include: { service: true },
      orderBy: { startedAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return this.prisma.incident.findUnique({
      where: { id },
      include: { service: true },
    });
  }

  async createIncident(serviceId: string, status: ServiceStatus, message: string, snapshot?: any) {
    // Check if an active incident already exists for this service
    const activeIncident = await this.prisma.incident.findFirst({
      where: {
        serviceId,
        resolvedAt: null,
      },
    });

    if (activeIncident) {
      return activeIncident;
    }

    this.logger.warn(`Creating incident for service ${serviceId}: ${message}`);
    const incident = await this.prisma.incident.create({
      data: {
        serviceId,
        status,
        message,
        snapshot: snapshot || null,
      },
      include: { service: true },
    });

    this.eventEmitter.emit(ServiceEvents.INCIDENT_CREATED, incident);
    return incident;
  }

  async resolveIncident(serviceId: string) {
    const activeIncident = await this.prisma.incident.findFirst({
      where: {
        serviceId,
        resolvedAt: null,
      },
    });

    if (!activeIncident) {
      return null;
    }

    this.logger.log(`Resolving incident for service ${serviceId}`);
    const resolvedIncident = await this.prisma.incident.update({
      where: { id: activeIncident.id },
      data: {
        resolvedAt: new Date(),
      },
      include: { service: true },
    });

    this.eventEmitter.emit(ServiceEvents.INCIDENT_RESOLVED, resolvedIncident);
    return resolvedIncident;
  }

  async resolveManual(id: string) {
    return this.prisma.incident.update({
      where: { id },
      data: {
        resolvedAt: new Date(),
      },
    });
  }
}
