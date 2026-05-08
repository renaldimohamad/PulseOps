"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HealthCheckScheduler_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const health_check_service_1 = require("./health-check.service");
let HealthCheckScheduler = HealthCheckScheduler_1 = class HealthCheckScheduler {
    healthCheckService;
    logger = new common_1.Logger(HealthCheckScheduler_1.name);
    isRunning = false;
    constructor(healthCheckService) {
        this.healthCheckService = healthCheckService;
    }
    async handleCron() {
        if (this.isRunning) {
            this.logger.warn('Previous health check still running, skipping...');
            return;
        }
        this.isRunning = true;
        try {
            await this.healthCheckService.checkAllServices();
        }
        finally {
            this.isRunning = false;
        }
    }
};
exports.HealthCheckScheduler = HealthCheckScheduler;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_30_SECONDS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthCheckScheduler.prototype, "handleCron", null);
exports.HealthCheckScheduler = HealthCheckScheduler = HealthCheckScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_check_service_1.HealthCheckService])
], HealthCheckScheduler);
//# sourceMappingURL=health-check.scheduler.js.map