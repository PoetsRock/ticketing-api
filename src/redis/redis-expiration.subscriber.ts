import { Injectable, OnModuleInit, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { SEAT_STATUS } from '../common/types';
import { PrismaService } from '../prisma/prisma.service';

export const HoldSeatPrefix = 'hold:seat:';

@Injectable()
export class RedisExpirationSubscriber implements OnModuleInit {
  private readonly subscriber: Redis;

  constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_SUBSCRIBER_CLIENT') subscriber: Redis,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {
    this.subscriber = subscriber;
  }

  onModuleInit() {
    void this.subscriber.subscribe('__keyevent@0__:expired', (err) => {
      if (err) {
        console.error('Failed to subscribe to Redis expired events', err);
      }
    });

    this.subscriber.on('message', this.handleExpiredKey.bind(this));
  }

  private async handleExpiredKey(channel: string, message: string) {
    console.log(`Received expired key: ${message} on channel: ${channel}`);
    if (message.startsWith(HoldSeatPrefix)) {
      // Key format: `hold:seat:{{seatId}}:{{eventId}}`
      const parts = message.split(':');
      const seatId = parts[2];
      const eventId = parts[3];

      if (seatId && eventId) {
        console.log(
          `Seat hold expired for seat ID: ${seatId}. Reverting to OPEN.`,
        );

        await this.prisma.seat.updateMany({
          where: {
            id: seatId,
            status: 'ON_HOLD',
          },
          data: {
            status: 'OPEN',
            customerId: null,
          },
        });

        await this.redis.incrby(`event:${eventId}:open_seats`, 1);
      }
    }
  }
}
