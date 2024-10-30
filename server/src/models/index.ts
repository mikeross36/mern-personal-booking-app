import { getModelForClass } from "@typegoose/typegoose";
import { User } from "./userModel";
import { Hotel } from "./hotelModel";
import { Booking } from "./bookingModel";

export const UserModel = getModelForClass(User);
export const HotelModel = getModelForClass(Hotel);
export const BookingModel = getModelForClass(Booking);
