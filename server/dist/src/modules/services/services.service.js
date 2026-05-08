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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicesService = void 0;
const common_1 = require("@nestjs/common");
const event_emitter_1 = require("@nestjs/event-emitter");
const prisma_service_1 = require("../../prisma/prisma.service");
const service_events_1 = require("../events/service.events");
const client_1 = require("@prisma/client");
let ServicesService = class ServicesService {
    prisma;
    eventEmitter;
    constructor(prisma, eventEmitter) {
        this.prisma = prisma;
        this.eventEmitter = eventEmitter;
    }
    async create(createServiceDto) {
        const service = await this.prisma.service.create({
            data: {
                ...createServiceDto,
                status: client_1.ServiceStatus.UNKNOWN,
            },
        });
        this.eventEmitter.emit(service_events_1.ServiceEvents.CREATED, service);
        return service;
    }
    async findAll(category, status) {
        return this.prisma.service.findMany({
            where: {
                ...(category && { category }),
                ...(status && { status }),
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const service = await this.prisma.service.findUnique({
            where: { id },
        });
        if (!service) {
            throw new common_1.NotFoundException(`Service with ID ${id} not found`);
        }
        return service;
    }
    async update(id, updateServiceDto) {
        await this.findOne(id);
        const service = await this.prisma.service.update({
            where: { id },
            data: updateServiceDto,
        });
        this.eventEmitter.emit(service_events_1.ServiceEvents.UPDATED, service);
        return service;
    }
    async remove(id) {
        const service = await this.findOne(id);
        await this.prisma.service.delete({
            where: { id },
        });
        this.eventEmitter.emit(service_events_1.ServiceEvents.DELETED, service);
        return { message: 'Service deleted successfully' };
    }
};
exports.ServicesService = ServicesService;
exports.ServicesService = ServicesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        event_emitter_1.EventEmitter2])
], ServicesService);
//# sourceMappingURL=services.service.js.map