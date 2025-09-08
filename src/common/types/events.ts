import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export type EventId = string;

export interface EventReq {
  numSeats: number;
  maxNumSeats?: number;
  eventName?: string;
  eventDateTimeStamp?: Date;
  eventLocation?: string;
  seatHoldTime?: number;
}

export interface IEvent extends EventReq {
  id: string;
  createdAt: Date;
  modifiedAt: Date;
  seatsId: string[];
}

export class CreateEventDto implements EventReq {
  @IsNumber()
  numSeats: number;

  @IsOptional()
  @IsNumber()
  maxNumSeats?: number;

  @IsOptional()
  @IsString()
  eventName?: string;

  @IsOptional()
  @IsDateString()
  eventDateTimeStamp?: Date;

  @IsOptional()
  @IsString()
  eventLocation?: string;

  @IsOptional()
  @IsNumber()
  seatHoldTime?: number;
}

export class UpdateEventDto extends PartialType(CreateEventDto) {}
