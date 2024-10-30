import { HotelType } from "../../../server/src/@types";

export type HotelResponseType = {
  result: number;
  data: {
    hotels?: HotelType[];
    hotel?: HotelType;
  };
};

export type HotelInputDataType = {
  name: string;
  city: string;
  country: string;
  description: string;
  category: string;
  pricePerNight: number;
  starRating: number;
  amenities: string[];
  imageFiles: FileList;
  imageUrls: string[];
  adults: number;
  kids: number;
};

export type HotelSearchParamsType = {
  destination?: string;
  checkIn?: string;
  checkOut?: string;
  adults?: string;
  kids?: string;
  currentPage?: string;
  amenities?: string[];
  category?: string[];
  stars?: string[];
  maxPrice?: string;
  sortOption?: string;
};

export type GuestInputDataType = {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  kids: number;
};

export type PaymentIntentResponseType = {
  message: string;
  paymentIntentResponse: {
    paymentIntentId: string;
    clientSecret: string;
    totalCost: number;
  };
};
