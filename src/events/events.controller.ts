import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateSeatDto } from '../common/types';
import { CreateEventDto } from '../common/types/events';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    if (createEventDto.numSeats < 10 || createEventDto.numSeats > 1000) {
      throw new Error(
        `An event must have at least 10 seats and cannot have more than 1000. You tried to create an event with ${createEventDto.numSeats} seats.`,
      );
    }

    if (!createEventDto.maxNumSeats) {
      createEventDto.maxNumSeats = 0;
    }
    return this.eventsService.create(createEventDto);
  }

  @Get(':eventId/open-count')
  async getOpenSeatsCount(@Param('eventId') eventId: string) {
    return { openSeats: await this.eventsService.getOpenSeatsCount(eventId) };
  }

  @Patch(':eventId/seats/:seatId')
  updateSeat(
    @Param('eventId') eventId: string,
    @Param('seatId') seatId: string,
    @Body()
    updateSeatDto: UpdateSeatDto,
  ): Promise<{ status: number; message: string }> {
    return this.eventsService.updateSeat(eventId, seatId, updateSeatDto);
  }
}
