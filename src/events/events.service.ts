import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { UpdateSeatDto } from '../common/types';
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

  public async updateSeat(
    eventId: string,
    seatId: string,
    updateSeatDto: UpdateSeatDto,
  ): Promise<{ status: number; message: string }> {
    return await this.seatsService.update({
      ...updateSeatDto,
      eventId,
      seatId,
    });
  }

  public async getOpenSeatsCount(eventId: string): Promise<number> {
    return this.seatsService.getOpenSeatsCount(eventId);
  }
}
