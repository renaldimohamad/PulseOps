import { Injectable, NotFoundException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceEvents } from '../events/service.events';
import { ServiceStatus } from '@prisma/client';

@Injectable()
export class ServicesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(createServiceDto: CreateServiceDto) {
    const service = await this.prisma.service.create({
      data: {
        ...createServiceDto,
        status: ServiceStatus.UNKNOWN,
      },
    });

    this.eventEmitter.emit(ServiceEvents.CREATED, service);
    return service;
  }

  async findAll(category?: string, status?: ServiceStatus) {
    return this.prisma.service.findMany({
      where: {
        ...(category && { category }),
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const service = await this.prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return service;
  }

  async update(id: string, updateServiceDto: UpdateServiceDto) {
    await this.findOne(id); // Check existence

    const service = await this.prisma.service.update({
      where: { id },
      data: updateServiceDto,
    });

    this.eventEmitter.emit(ServiceEvents.UPDATED, service);
    return service;
  }

  async remove(id: string) {
    const service = await this.findOne(id); // Check existence

    await this.prisma.service.delete({
      where: { id },
    });

    this.eventEmitter.emit(ServiceEvents.DELETED, service);
    return { message: 'Service deleted successfully' };
  }
}
