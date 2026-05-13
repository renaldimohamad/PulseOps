import { Controller, Get, Param, Patch } from '@nestjs/common';
import { IncidentsService } from './incidents.service';

@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Get()
  findAll() {
    return this.incidentsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.incidentsService.findActive();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(id);
  }

  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.incidentsService.resolveManual(id);
  }
}
