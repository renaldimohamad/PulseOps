import { HealthCheckService } from './health-check.service';
export declare class HealthCheckScheduler {
    private healthCheckService;
    private readonly logger;
    private isRunning;
    constructor(healthCheckService: HealthCheckService);
    handleCron(): Promise<void>;
}
