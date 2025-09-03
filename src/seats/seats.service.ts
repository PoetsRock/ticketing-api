import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Redis } from 'ioredis';
import { v4 as uuidV4 } from 'uuid';
import { SEAT_STATUS, UpdateSeatDto } from '../common/types';
import { PrismaService } from '../prisma/prisma.service';
import { HoldSeatPrefix } from '../redis/redis-expiration.subscriber';
import SeatCreateManyInput = Prisma.SeatCreateManyInput;

export type UpdateSeatResponse = { status: number; message: string };

@Injectable()
export class SeatsService {
  public constructor(
    private readonly prisma: PrismaService,
    @Inject('REDIS_CLIENT') private readonly redis: Redis,
  ) {}

  public async createSeatsForEvent({
    numSeats,
    eventId,
  }: {
    numSeats: number;
    eventId: string;
  }): Promise<string[]> {
    const seats: SeatCreateManyInput[] = [];
    const seatIds: string[] = [];
    const date = new Date();

    for (let i = 0; i < numSeats; i++) {
      const id = uuidV4();
      seatIds.push(id);
      seats.push({
        id,
        modifiedAt: date,
        assignedSeating: false,
        eventId,
        price: '10',
        status: SEAT_STATUS.OPEN,
      });
    }

    await this.prisma.seat.createMany({
      data: seats,
    });

    // Initialize open seats counter
    await this.redis.setex(this.getOpenSeatsKey(eventId), 300, numSeats);

    return seatIds;
  }

  public async update({
    customerId,
    eventId,
    status,
    seatId,
  }: UpdateSeatDto & {
    seatId: string;
    eventId: string;
  }): Promise<UpdateSeatResponse> {
    const redisKey = `${HoldSeatPrefix}${seatId}:${eventId}`;
    if (status === SEAT_STATUS.ON_HOLD) {
      return this.holdSeat({
        customerId,
        redisKey,
        seatId,
      });
    } else if (status === SEAT_STATUS.RESERVED) {
      return this.reserveSeat({
        customerId,
        redisKey,
        seatId,
      });
    }
  }

  public async holdSeat({
    customerId,
    seatId,
    redisKey,
  }: {
    customerId: string;
    redisKey: string;
    seatId: string;
  }): Promise<UpdateSeatResponse> {
    try {
      const updatedSeat = await this.prisma.seat.update({
        where: {
          id: seatId,
          status: SEAT_STATUS.OPEN,
        },
        data: {
          customerId,
          status: SEAT_STATUS.ON_HOLD,
          modifiedAt: new Date(),
        },
      });

      await Promise.all([
        this.redis.set(redisKey, '1', 'EX', 60),
        this.updateOpenSeatsCounter(updatedSeat.eventId, -1),
      ]);

      console.log('redisKey: ', redisKey);
      return {
        status: 200,
        message: `We're holding seat ${seatId}. You have 60 seconds to purchase the ticket, or to renew your hold`,
      };
    } catch (e) {
      console.error(e);
      return {
        status: 401,
        message: `We did not find that seat, or that seat has already been held or purchased by another customer.`,
      };
    }
  }

  public async reserveSeat({
    customerId,
    redisKey,
    seatId,
  }: {
    customerId: string;
    seatId: string;
    redisKey: string;
  }): Promise<UpdateSeatResponse> {
    try {
      const reservedSeat = await this.prisma.seat.update({
        where: { id: seatId, status: SEAT_STATUS.ON_HOLD, customerId },
        data: { status: SEAT_STATUS.RESERVED },
      });

      console.log('reservedSeat: ', reservedSeat);

      await this.redis.del(redisKey);
      return {
        status: 200,
        message: `You've purchase seat ${seatId}'. Enjoy the show!`,
      };
    } catch (e) {
      console.error(e);
      return {
        status: 401,
        message: `We did not find a ticket on hold for your account. Please try again, and make sure you have first placed the seat on hold.`,
      };
    }
  }

  public async getOpenSeatsCount(eventId: string): Promise<number> {
    const cached = await this.redis.get(this.getOpenSeatsKey(eventId));

    if (cached !== null) {
      return parseInt(cached, 10);
    }

    // Cache miss - query DB and cache result
    const count = await this.prisma.seat.count({
      where: { eventId, status: SEAT_STATUS.OPEN },
    });

    await this.redis.setex(this.getOpenSeatsKey(eventId), 300, count); // 5min TTL
    return count;
  }

  private getOpenSeatsKey(eventId: string): string {
    return `event:${eventId}:open_seats`;
  }

  private async updateOpenSeatsCounter(
    eventId: string,
    delta: number,
  ): Promise<void> {
    const key = this.getOpenSeatsKey(eventId);
    const exists = await this.redis.exists(key);

    if (exists) {
      await this.redis.incrby(key, delta);
    } else {
      // Initialize counter from DB
      const count = await this.prisma.seat.count({
        where: { eventId, status: SEAT_STATUS.OPEN },
      });
      await this.redis.setex(key, 300, count);
    }
  }
}
