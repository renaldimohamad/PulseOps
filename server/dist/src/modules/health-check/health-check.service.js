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
var HealthCheckService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
const service_events_1 = require("../events/service.events");
const rxjs_1 = require("rxjs");
const ws_gateway_1 = require("../ws/ws.gateway");
let HealthCheckService = HealthCheckService_1 = class HealthCheckService {
    prisma;
    httpService;
    eventEmitter;
    wsGateway;
    logger = new common_1.Logger(HealthCheckService_1.name);
    constructor(prisma, httpService, eventEmitter, wsGateway) {
        this.prisma = prisma;
        this.httpService = httpService;
        this.eventEmitter = eventEmitter;
        this.wsGateway = wsGateway;
    }
    async checkAllServices() {
        this.logger.log('Starting health check for all services...');
        const services = await this.prisma.service.findMany();
        for (const service of services) {
            await this.checkService(service);
        }
        this.logger.log('Health check completed.');
    }
    async checkService(service) {
        const startTime = Date.now();
        let status = client_1.ServiceStatus.DOWN;
        let latency = 0;
        let rawStatus = null;
        let lastError = null;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(service.url, { timeout: 5000 }));
            latency = Date.now() - startTime;
            rawStatus = response.status;
            status = rawStatus >= 200 && rawStatus < 400
                ? client_1.ServiceStatus.UP
                : client_1.ServiceStatus.DOWN;
            if (status === client_1.ServiceStatus.DOWN) {
                lastError = `Unhealthy status code: ${rawStatus}`;
            }
        }
        catch (error) {
            latency = Date.now() - startTime;
            status = client_1.ServiceStatus.DOWN;
            rawStatus = error.response?.status || null;
            lastError = error.message;
            this.logger.warn(`Service ${service.name} (${service.url}) is DOWN: ${lastError}`);
        }
        if (service.status !== status || service.rawStatus !== rawStatus) {
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
            console.log(`[HealthCheck] Service ${service.name} => ${status} (${rawStatus})`);
            this.wsGateway.emitServiceUpdate(updatedService);
            this.eventEmitter.emit(service_events_1.ServiceEvents.STATUS_CHANGED, updatedService);
            this.logger.log(`Service ${service.name} status updated to ${status}`);
        }
        else {
            this.logger.debug(`Service ${service.name} state unchanged, skipping update.`);
        }
    }
};
exports.HealthCheckService = HealthCheckService;
exports.HealthCheckService = HealthCheckService = HealthCheckService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        axios_1.HttpService,
        event_emitter_1.EventEmitter2,
        ws_gateway_1.WsGateway])
], HealthCheckService);
//# sourceMappingURL=health-check.service.js.map