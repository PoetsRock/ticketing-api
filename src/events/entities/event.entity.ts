import { IEvent } from '../../common/types/events';

export class EventEntity implements IEvent {
  public createdAt: Date;
  public eventLocation: string;
  public eventName: string;
  public id: string;
  public modifiedAt: Date;
  public numSeats: number;
  public maxNumSeats: number;
  public eventDateTimeStamp?: Date;
  public seatHoldTime: number;
  public seatsId: string[];
}
