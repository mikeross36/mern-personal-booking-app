import { HotelType } from "../../../server/src/@types";

type PropsType = {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  kids: number;
  numberOfNights: number;
  hotel: HotelType;
};

export default function BookingDetails({
  checkIn,
  checkOut,
  adults,
  kids,
  numberOfNights,
  hotel,
}: PropsType) {
  return (
    <section className="grid gap-4 rounded-lg border border-slate-300 p-5 h-fit">
      <h2 className="text-xl font-bold">Your Booking Details</h2>
      <div className="border-b border-slate-300 py-2">
        <span>Location</span>
        <p className="font-bold">{`${hotel.name}, ${hotel.city}, ${hotel.country}`}</p>
      </div>
      <div className="flex justify-between">
        <div>
          <span>Check-in</span>
          <p className="font-bold">{checkIn.toDateString()}</p>
        </div>
        <div>
          <span>Check-out</span>
          <p className="font-bold">{checkOut.toDateString()}</p>
        </div>
      </div>
      <div className="border-t border-b py-2">
        <span>Total length of stay:</span>
        <p className="font-bold">{numberOfNights}</p>
      </div>
      <div>
        <span>Guests</span>
        <p className="font-bold">
          {adults} adults & {kids} children
        </p>
      </div>
    </section>
  );
}
