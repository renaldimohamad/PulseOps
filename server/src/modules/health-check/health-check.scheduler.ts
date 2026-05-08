import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HealthCheckService } from './health-check.service';

@Injectable()
export class HealthCheckScheduler {
  private readonly logger = new Logger(HealthCheckScheduler.name);
  private isRunning = false;

  constructor(private healthCheckService: HealthCheckService) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    if (this.isRunning) {
      this.logger.warn('Previous health check still running, skipping...');
      return;
    }

    this.isRunning = true;
    try {
      await this.healthCheckService.checkAllServices();
    } finally {
      this.isRunning = false;
    }
  }
}
