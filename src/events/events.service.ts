import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { SEAT_STATUS, UpdateSeatDto } from '../common/types';
import { CreateEventDto } from '../common/types/events';
import { PrismaService } from '../prisma/prisma.service';
import { SeatsService } from '../seats/seats.service';
import { EventEntity } from './entities/event.entity';

@Injectable()
export class EventsService {
  public constructor(
    private readonly seatsService: SeatsService,
    private readonly prisma: PrismaService,
  ) {}

  public async create(createEventDto: CreateEventDto): Promise<EventEntity> {
    const eventId = uuidV4();

    const event = await this.prisma.event.create({
      data: {
        id: eventId,
        eventName: createEventDto.eventName,
        eventLocation: createEventDto.eventLocation,
        numSeats: createEventDto.numSeats,
        maxNumSeats: createEventDto.maxNumSeats,
        eventDateTimeStamp: createEventDto.eventDateTimeStamp,
        seatHoldTime: createEventDto.seatHoldTime ?? 60,
        seatsId: [],
      },
    });

    const seats: string[] = await this.seatsService.createSeatsForEvent({
      eventId,
      numSeats: createEventDto.numSeats,
    });

    return <EventEntity>{
      createdAt: event.createdAt,
      eventDateTimeStamp: event.eventDateTimeStamp,
      eventLocation: event.eventLocation ?? '',
      eventName: event.eventName ?? '',
      id: event.id,
      modifiedAt: event.modifiedAt,
      numSeats: event.numSeats,
      seatHoldTime: event.seatHoldTime ?? 60,
      seatsId: seats,
    };
  }

  public async findEvent(eventId: string): Promise<EventEntity> {
    return this.prisma.event.findUnique({
      where: { id: eventId },
    });
  }

  public async updateSeat(
    eventId: string,
    seatId: string,
    updateSeatDto: UpdateSeatDto,
  ): Promise<{ status: number; message: string }> {
    const input = {
      ...updateSeatDto,
      eventId,
      seatId,
    };
    if (updateSeatDto.status === SEAT_STATUS.ON_HOLD) {
      const event = await this.findEvent(eventId);
      input['maxNumSeats'] = event?.maxNumSeats ? event.maxNumSeats : 0;
    }

    return await this.seatsService.update(input);
  }

  public async getOpenSeatsCount(eventId: string): Promise<number> {
    return this.seatsService.getOpenSeatsCount(eventId);
  }
}
