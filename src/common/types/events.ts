import { PartialType } from '@nestjs/mapped-types';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export type EventId = string;

export interface Location {
  address1: string;
  address2?: string;
  city: string;
  country: string;
  postcode: string;
}

export interface EventReq {
  numSeats: number;
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
