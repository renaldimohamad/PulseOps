import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('overview')
  getOverview() {
    return this.analyticsService.getOverview();
  }

  @Get('history')
  getHistory(@Query('timeframe') timeframe: '1h' | '6h' | '24h' | '7d') {
    return this.analyticsService.getHistory(timeframe);
  }

  @Get('latency-trend')
  getLatencyTrend() {
    return this.analyticsService.getLatencyTrend();
  }

  @Get('snapshot')
  getSnapshot() {
    return this.analyticsService.getSnapshot();
  }

  @Get('incidents')
  getIncidents() {
    return this.analyticsService.getIncidentsSummary();
  }

  @Get('performance-summary')
  getPerformanceSummary() {
    return this.analyticsService.getPerformanceSummary();
  }
}
