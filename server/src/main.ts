import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Disable ETag to prevent browser caching
  app.disable('etag');

  // Enable CORS with production safety
  const frontendUrl = configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
  
  app.enableCors({
    origin: [
      frontendUrl,
      'https://pulseops.renaldi.fun',
      'https://pulseops.renaldi.fun/'
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // No-cache middleware for API predictability
  app.use((req: any, res: any, next: any) => {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    next();
  });

  const port = configService.get<number>('PORT') || 3001;
  const nodeEnv = configService.get<string>('NODE_ENV') || 'development';

  await app.listen(port, '0.0.0.0');
  
  logger.log(`🚀 PulseOps API initialized in ${nodeEnv} mode`);
  logger.log(`🌐 Traffic allowed from: ${frontendUrl}`);
}
bootstrap();

