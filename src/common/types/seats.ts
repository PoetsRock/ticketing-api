import { IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';

export type seatNum = number;
export type seatsId = string;

export enum SEAT_STATUS {
  ON_HOLD = 'ON_HOLD',
  OPEN = 'OPEN',
  RESERVED = 'RESERVED',
}

export interface Seats {
  seats: Map<seatNum, CreateSeatDto>;
}

export interface ISeat extends SeatReq {
  id: string;
  modifiedAt: Date;
}

export interface SeatReq {
  eventId: string;
  price: string;
  status: SEAT_STATUS;
  assignedSeating?: boolean;
  row?: string;
  seatNumber?: string;
  section?: string;
}

export class CreateSeatDto implements SeatReq {
  @IsUUID()
  eventId: string;

  @IsOptional()
  @IsUUID()
  customerId?: string;

  @IsString()
  price: string;

  status: SEAT_STATUS;

  @IsBoolean()
  @IsOptional()
  assignedSeating: boolean;

  @IsOptional()
  @IsString()
  row?: string;

  @IsOptional()
  @IsString()
  seatNumber?: string;

  @IsOptional()
  @IsString()
  section?: string;
}

export class UpdateSeatDto {
  @IsString()
  customerId: string;

  @IsString()
  status: SEAT_STATUS;
}
