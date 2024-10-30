import { prop, Ref, modelOptions, Severity } from "@typegoose/typegoose";
import { User } from "./userModel";
import { Booking } from "./bookingModel";
import mongoose from "mongoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
  options: { allowMixed: Severity.ALLOW },
})
export class Hotel {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true })
  name: string;

  @prop({ required: true })
  city: string;

  @prop({ required: true })
  country: string;

  @prop({ required: true })
  description: string;

  @prop({ required: true })
  category: string;

  @prop({ required: true })
  adults: number;

  @prop({ required: true })
  kids: number;

  @prop({ required: true, type: String })
  amenities: mongoose.Types.Array<string>;

  @prop({ required: true })
  pricePerNight: number;

  @prop({ required: true })
  starRating: number;

  @prop({ required: true })
  imageUrls: string[];

  @prop({ required: true })
  lastUpdate: Date;
  //   virtuals
  @prop({
    ref: Booking,
    foreignField: "hotel",
    localField: "_id",
    justOne: false,
  })
  bookings: Ref<Booking>[];
}
