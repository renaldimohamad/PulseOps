import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaModule } from './prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { ServicesModule } from './modules/services/services.module';
import { HealthCheckModule } from './modules/health-check/health-check.module';
import { WsModule } from './modules/ws/ws.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { IncidentsModule } from './modules/incidents/incidents.module';
import { AlertsModule } from './modules/alerts/alerts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    PrismaModule,
    HealthModule,
    ServicesModule,
    HealthCheckModule,
    WsModule,
    AnalyticsModule,
    IncidentsModule,
    AlertsModule,
  ],
})
export class AppModule {}
