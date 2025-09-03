import { Module } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisExpirationSubscriber } from './redis-expiration.subscriber';

@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async () => {
        const redis = new Redis();
        await redis.config('SET', 'notify-keyspace-events', 'Ex');
        return redis;
      },
    },
    {
      provide: 'REDIS_SUBSCRIBER_CLIENT',
      useFactory: () => new Redis(),
    },
    RedisExpirationSubscriber,
  ],
  imports: [PrismaModule],
  exports: ['REDIS_CLIENT', 'REDIS_SUBSCRIBER_CLIENT'],
})
export class RedisModule {}
