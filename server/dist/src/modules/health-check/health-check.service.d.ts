import { HttpService } from '@nestjs/axios';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { WsGateway } from '../ws/ws.gateway';
export declare class HealthCheckService {
    private prisma;
    private httpService;
    private eventEmitter;
    private wsGateway;
    private readonly logger;
    constructor(prisma: PrismaService, httpService: HttpService, eventEmitter: EventEmitter2, wsGateway: WsGateway);
    checkAllServices(): Promise<void>;
    private checkService;
}
