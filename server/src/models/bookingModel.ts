import { prop, Ref, pre, modelOptions } from "@typegoose/typegoose";
import { User } from "./userModel";
import { Hotel } from "./hotelModel";

@pre<Booking>(/^find/, function (next) {
  this.populate({ path: "user", select: "userName avatar" });
  next();
})
@pre<Booking>(/^find/, function (next) {
  this.populate({ path: "hotel", select: "name city country imageUrls" });
  next();
})
@modelOptions({
  schemaOptions: {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Booking {
  @prop({ required: true, ref: () => User })
  user: Ref<User>;

  @prop({ required: true, ref: () => Hotel })
  hotel: Ref<Hotel>;

  @prop({ required: true })
  adults: number;

  @prop({ required: true })
  kids: number;

  @prop({ required: true })
  checkIn: Date;

  @prop({ required: true })
  checkOut: Date;

  @prop({ required: true })
  totalCost: number;
}
