import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HealthCheckService } from './health-check.service';
import { HealthCheckScheduler } from './health-check.scheduler';
import { WsModule } from '../ws/ws.module';

@Module({
  imports: [HttpModule, WsModule],
  providers: [HealthCheckService, HealthCheckScheduler],
})
export class HealthCheckModule {}
