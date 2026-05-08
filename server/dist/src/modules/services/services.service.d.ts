import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceStatus } from '@prisma/client';
export declare class ServicesService {
    private prisma;
    private eventEmitter;
    constructor(prisma: PrismaService, eventEmitter: EventEmitter2);
    create(createServiceDto: CreateServiceDto): Promise<{
        url: string;
        name: string;
        category: string;
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        latency: number | null;
        rawStatus: number | null;
        lastError: string | null;
        lastChecked: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(category?: string, status?: ServiceStatus): Promise<{
        url: string;
        name: string;
        category: string;
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        latency: number | null;
        rawStatus: number | null;
        lastError: string | null;
        lastChecked: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        url: string;
        name: string;
        category: string;
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        latency: number | null;
        rawStatus: number | null;
        lastError: string | null;
        lastChecked: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, updateServiceDto: UpdateServiceDto): Promise<{
        url: string;
        name: string;
        category: string;
        id: string;
        status: import(".prisma/client").$Enums.ServiceStatus;
        latency: number | null;
        rawStatus: number | null;
        lastError: string | null;
        lastChecked: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
