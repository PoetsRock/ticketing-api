import { Inject, Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class SeatHoldService {
  public constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async holdSeats(
    customerId: string,
    eventId: string,
    seatIds: string[],
    ttlSeconds: number = 60,
    maxSeatsPerEvent: number = 10,
  ): Promise<void> {
    const key = this.getHoldKey(customerId, eventId);

    // Check current holds + new seats don't exceed limit
    const currentCount = await this.redis.scard(key);
    if (currentCount + seatIds.length > maxSeatsPerEvent) {
      throw new Error(
        `Cannot hold more than ${maxSeatsPerEvent} seats per event`,
      );
    }

    // Add seats and set TTL
    await this.redis.sadd(key, ...seatIds);
    await this.redis.expire(key, ttlSeconds);
  }

  async getHeldSeats(customerId: string, eventId: string): Promise<string[]> {
    const key = this.getHoldKey(customerId, eventId);
    return this.redis.smembers(key);
  }

  async releaseSeats(
    customerId: string,
    eventId: string,
    seatIds: string[],
  ): Promise<void> {
    const key = this.getHoldKey(customerId, eventId);
    await this.redis.srem(key, ...seatIds);
  }

  async getAllHolds(customerId: string): Promise<Record<string, string[]>> {
    const pattern = `seat_holds:${customerId}:*`;
    const keys = await this.redis.keys(pattern);

    const holds: Record<string, string[]> = {};
    for (const key of keys) {
      const eventId = key.split(':')[2];
      holds[eventId] = await this.redis.smembers(key);
    }

    return holds;
  }

  private getHoldKey(customerId: string, eventId: string): string {
    return `seat_holds:${customerId}:${eventId}`;
  }
}
