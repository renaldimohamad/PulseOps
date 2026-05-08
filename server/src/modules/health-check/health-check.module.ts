import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckService } from './health-check.service';
import { HealthCheckScheduler } from './health-check.scheduler';

@Module({
  imports: [HttpModule],
  providers: [HealthCheckService, HealthCheckScheduler],
})
export class HealthCheckModule {}
