import { useGetAllUserBookings } from "@/features/booking";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ERoutes } from "@/@types/links";

export default function MyBookings() {
  const { data: myBookings } = useGetAllUserBookings();

  return (
    <section className="space-y-5 text-zinc-600">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      {myBookings &&
        myBookings.map((booking) => {
          return (
            <div
              key={booking._id}
              className="grid lg:grid-cols-[1fr_3fr] border border-slate-300 rounded-lg p-8 gap-5"
            >
              <div className="lg:w-full lg:h-[250px]">
                <img
                  src={booking.hotel.imageUrls[0]}
                  alt="hotel image"
                  className="w-full object-cover object-center"
                />
              </div>
              <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                <h3 className="text-xl font-bold">{booking.hotel.name}</h3>
                <p>
                  {booking.hotel.city}, {booking.hotel.country}
                </p>
                <div className="grid">
                  <span className="font-bold mr-2">Dates: </span>
                  <p>from: {new Date(booking.checkIn).toDateString()}</p>
                  <p>to: {new Date(booking.checkOut).toDateString()}</p>
                </div>
                <p className="text-sm font-semibold">
                  {booking.adults} adults, {booking.kids} children
                </p>
                <p className="font-bold">total: {booking.totalCost}€</p>
                <Link
                  to={`${ERoutes.hoteldetails}/${booking.hotel._id}`}
                  className="ml-1 p-1 md:self-end md:mr-4"
                >
                  <Button variant={"ringHover"}>Details</Button>
                </Link>
              </div>
            </div>
          );
        })}
    </section>
  );
}
