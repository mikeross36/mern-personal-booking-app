import { UserType } from "./users";
import { HotelType } from "../../../server/src/@types";

export type BookingDataType = {
  userName: string;
  email: string;
  adults: number;
  kids: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  paymentIntentId: string;
  totalCost: number;
};

export type BookingType = {
  _id?: string;
  user: UserType;
  hotel: HotelType;
  userName: string;
  email: string;
  adults: number;
  kids: number;
  checkIn: Date;
  checkOut: Date;
  totalCost: number;
};

export type BookingResponseType = {
  result: number;
  data: {
    bookings?: BookingType[];
    booking?: BookingType;
  };
};
