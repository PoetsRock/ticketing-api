import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UpdateSeatDto } from '../common/types';
import { CreateEventDto } from '../common/types/events';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
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
