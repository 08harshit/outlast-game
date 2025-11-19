import { Injectable, OnModuleInit, INestApplication, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('PrismaService');

  constructor() {
    super();
    this.logger.log('🗄️ PrismaService constructor called');
  }

  async onModuleInit() {
    this.logger.log('🗄️ onModuleInit called - connecting to database...');
    await this.$connect();
    this.logger.log('✅ PrismaService connected to database');
  }

  async onModuleDestroy() {
    this.logger.log('🗄️ onModuleDestroy called - disconnecting from database...');
    await this.$disconnect();
    this.logger.log('✅ PrismaService disconnected from database');
  }

  // Optional helper to enable shutdown hooks when using Nest
  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
