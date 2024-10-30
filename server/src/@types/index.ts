import { User } from "../models/userModel";
import { Booking } from "../models/bookingModel";

export type SmtpType = {
  user: string;
  pass: string;
  host: string;
  port: string;
  secure: string;
};

export type HotelType = {
  _id: string;
  user: User;
  name: string;
  city: string;
  country: string;
  description: string;
  category: string;
  adults: number;
  kids: number;
  amenities: string[];
  pricePerNight: number;
  starRating: number;
  imageUrls: string[];
  lastUpdate: Date;
  bookings: Booking[];
};

export type HotelSearchResponseType = {
  data: HotelType[];
  pagination: {
    totalHotels: number;
    currentPage: number;
    totalPages: number;
  };
};
