import { Module, forwardRef } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { AnalyticsModule } from '../analytics/analytics.module';

@Module({
  imports: [forwardRef(() => AnalyticsModule)],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
