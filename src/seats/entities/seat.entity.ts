import { ISeat, SEAT_STATUS } from '../../common/types';

export class SeatEntity implements ISeat {
  public assignedSeating: boolean;
  public eventId: string;
  public id: string;
  public modifiedAt: Date;
  public price: string;
  public status: SEAT_STATUS;
  public row?: string;
  public seatNumber?: string;
  public section?: string;
}
