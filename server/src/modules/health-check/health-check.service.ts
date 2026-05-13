import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { ServiceStatus } from '@prisma/client';
import { ServiceEvents } from '../events/service.events';
import { firstValueFrom } from 'rxjs';
import { IncidentsService } from '../incidents/incidents.service';
import { AlertsService } from '../alerts/alerts.service';

@Injectable()
export class HealthCheckService {
  private readonly logger = new Logger(HealthCheckService.name);

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private eventEmitter: EventEmitter2,
    private incidentsService: IncidentsService,
    private alertsService: AlertsService,
  ) {}

  async checkAllServices() {
    this.logger.log('Starting health check for all services...');
    const services = await this.prisma.service.findMany();

    await Promise.all(services.map((service) => this.checkService(service)));
    
    // Trigger intelligent analytics refresh
    this.eventEmitter.emit('analytics.refresh');
    
    this.logger.log('Health check completed.');
  }

  private async checkService(service: any) {
    const startTime = performance.now();
    let status: ServiceStatus = ServiceStatus.DOWN;
    let latency = 0;
    let rawStatus: number | null = null;
    let lastError: string | null = null;
    let snapshot: any = null;

    try {
      const response = await firstValueFrom(
        this.httpService.get(service.url, { 
          timeout: 10000,
          validateStatus: () => true 
        }),
      );

      latency = Math.round(performance.now() - startTime);
      rawStatus = response.status;
      snapshot = {
        headers: response.headers,
        status: response.status,
        statusText: response.statusText,
      };
      
      if (rawStatus >= 200 && rawStatus < 400) {
        if (latency >= 1500) {
          status = ServiceStatus.DOWN;
          lastError = `Critical Latency: ${latency}ms`;
        } else if (latency >= 1000) {
          status = ServiceStatus.DEGRADED;
          lastError = `High Latency: ${latency}ms`;
        } else {
          status = ServiceStatus.UP;
        }
      } else if (rawStatus === 401 || rawStatus === 403) {
        status = ServiceStatus.PROTECTED;
      } else if (rawStatus === 404) {
        status = ServiceStatus.DEGRADED;
      } else if (rawStatus >= 500) {
        status = ServiceStatus.DOWN;
      } else {
        status = ServiceStatus.DOWN;
      }
        
      if (status === ServiceStatus.DOWN && !lastError) {
        lastError = `Unhealthy status code: ${rawStatus}`;
      }
    } catch (error: any) {
      latency = Math.round(performance.now() - startTime);
      status = ServiceStatus.DOWN;
      rawStatus = error.response?.status || null;
      snapshot = error.response ? {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data,
      } : { error: error.message };
      
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        lastError = 'Connection Timeout';
      } else if (error.code === 'ENOTFOUND') {
        lastError = 'DNS Failure';
      } else if (error.code === 'ECONNREFUSED') {
        lastError = 'Connection Refused';
      } else {
        lastError = error.message;
      }
    }

    // 1. Store Latency Log (Telemetry)
    await this.prisma.latencyLog.create({
      data: {
        serviceId: service.id,
        latency,
        status: rawStatus,
      },
    });

    // 2. Incident Management
    if (status === ServiceStatus.DOWN) {
      await this.incidentsService.createIncident(
        service.id,
        status,
        lastError || 'Unknown Error',
        snapshot,
      );
    } else if (service.status === ServiceStatus.DOWN) {
      // Resolve incident if it was DOWN before
      await this.incidentsService.resolveIncident(service.id);
    }

    // 3. Alert Evaluation
    await this.alertsService.evaluateThresholds(service.id, latency, status);

    // 3.5 Intelligent Degradation Detection
    if (status !== ServiceStatus.DOWN && latency > 1000) {
      this.eventEmitter.emit('service.degraded', { ...service, status, latency });
    }

    // 4. Update Main Service Record
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

    this.eventEmitter.emit(ServiceEvents.STATUS_CHANGED, updatedService);
    
    if (service.status !== status) {
      this.logger.log(`Service ${service.name} status transition: ${service.status} -> ${status}`);
    }
  }
}
