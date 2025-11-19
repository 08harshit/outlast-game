import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { SocketIOAdapter } from './socket-io.adapter';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  logger.log('🚀 Step 1: Creating NestFactory...');
  const app = await NestFactory.create(AppModule);
  logger.log('✅ Step 1: AppModule created');
  
  logger.log('🚀 Step 2: Enabling CORS...');
  // Enable CORS for HTTP requests
  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  logger.log('✅ Step 2: CORS enabled for all origins');

  logger.log('🚀 Step 3: Configuring Socket.IO adapter...');
  // Configure Socket.IO adapter with CORS
  app.useWebSocketAdapter(new SocketIOAdapter(app));
  logger.log('✅ Step 3: Socket.IO adapter configured with CORS');

  logger.log('🚀 Step 4: Starting server...');
  const PORT = process.env.PORT ?? 3000;
  await app.listen(PORT);
  logger.log(`✅ Step 4: Server listening on port ${PORT}`);
  logger.log(`🔌 WebSocket gateway ready at ws://localhost:${PORT}/socket.io/`);
}

bootstrap().catch(err => {
  const logger = new Logger('Bootstrap');
  logger.error('❌ Failed to start server:', err);
  process.exit(1);
});
