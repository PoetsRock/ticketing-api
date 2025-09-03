import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [SeatsController],
  providers: [SeatsService],
  exports: [],
})
export class SeatsModule {}
