import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { SeatsService } from './seats.service';
import { SeatsController } from './seats.controller';
import { SeatHoldService } from './seat-hold.service';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [SeatsController],
  providers: [SeatsService, SeatHoldService],
  exports: [SeatsService, SeatHoldService],
})
export class SeatsModule {}
