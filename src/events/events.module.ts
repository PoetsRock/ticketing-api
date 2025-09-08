import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { SeatHoldService } from '../seats/seat-hold.service';
import { SeatsService } from '../seats/seats.service';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [EventsController],
  providers: [EventsService, SeatsService, SeatHoldService],
})
export class EventsModule {}
