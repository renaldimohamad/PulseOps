import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckService } from './health-check.service';
import { HealthCheckScheduler } from './health-check.scheduler';
import { IncidentsModule } from '../incidents/incidents.module';
import { AlertsModule } from '../alerts/alerts.module';

@Module({
  imports: [HttpModule, IncidentsModule, AlertsModule],
  providers: [HealthCheckService, HealthCheckScheduler],
})
export class HealthCheckModule {}
