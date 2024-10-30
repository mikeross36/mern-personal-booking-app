import { useParams } from "react-router-dom";
import { useGetHotel } from "@/features/hotel";
import { Star } from "lucide-react";
import GuestInputData from "@/data-input/guests/GuestInputData";

export default function HotelDetails() {
  const { id } = useParams();
  const { data: hotel } = useGetHotel(id || "");

  return (
    <section className="flex flex-col gap-6 lg:place-items-center text-zinc-600">
      <div>
        <span className="flex py-4 lg:items-center">
          {[...Array(hotel?.starRating).keys()].map((_, idx) => {
            return (
              <Star
                key={idx}
                size={32}
                strokeWidth={0.5}
                absoluteStrokeWidth
                className="fill-yellow-400"
              />
            );
          })}
        </span>
        <h2 className="text-3xl font-bold">{hotel?.name}</h2>
      </div>
      <div
        className={`grid place-items-center gap-4 ${
          hotel?.imageUrls && hotel.imageUrls.length > 1
            ? "lg:grid-cols-3"
            : "grid"
        }`}
      >
        {hotel?.imageUrls?.map((image) => {
          return (
            <div key={hotel._id}>
              <img
                src={image}
                alt="hotel image"
                className="rounded-md w-full h-full object-cover object-center"
              />
            </div>
          );
        })}
        <div className="flex flex-col items-start gap-4 px-4 md:flex-row">
          {hotel?.amenities?.map((amenity) => {
            return (
              <p
                key={amenity}
                className="bg-slate-300 px-2 py-1 rounded-3xl text-xs text-black whitespace-nowrap"
              >
                {amenity}
              </p>
            );
          })}
        </div>
        <div className="px-4 lg:w-1/2">
          <article className="whitespace-pre-line text-justify">
            {hotel?.description}
          </article>
        </div>
        <div className="h-fit px-4 lg:w-1/3">
          <GuestInputData
            hotelId={hotel?._id as string}
            pricePerNight={hotel?.pricePerNight as number}
          />
        </div>
      </div>
    </section>
  );
}
