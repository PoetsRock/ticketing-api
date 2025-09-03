import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisModule } from '../redis/redis.module';
import { SeatsService } from '../seats/seats.service';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';

@Module({
  imports: [PrismaModule, RedisModule],
  controllers: [EventsController],
  providers: [EventsService, SeatsService],
})
export class EventsModule {}
