import { HotelType } from "../../../server/src/@types";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ERoutes } from "@/@types/links";

export default function SearchResult({ hotel }: { hotel: HotelType }) {
  return (
    <main className="grid xl:grid-cols-[2fr_3fr] border border-slate-300 rounded-lg p-8 gap-8">
      <div className="w-full h-[300px]">
        <img
          src={hotel.imageUrls[0]}
          alt="hotel images"
          className="w-full h-full object-cover object-center"
        />
      </div>
      <div className="grid">
        <div>
          <div className="flex items-center">
            <span className="flex">
              {[...Array(hotel.starRating).keys()].map((_, idx) => {
                return (
                  <Star
                    size={32}
                    strokeWidth={0.5}
                    absoluteStrokeWidth
                    key={idx}
                    className="fill-yellow-400"
                  />
                );
              })}
            </span>
            <p className="ml-1 text-sm">{hotel.category}</p>
          </div>
          <Link
            to={`${ERoutes.hoteldetails}/${hotel._id}`}
            className="text-2xl font-bold cursor-pointer hover:underline hotever:underline-offset-2"
          >
            {hotel.name}
          </Link>
        </div>
      </div>
      <div>
        <div className="line-clamp-4">{hotel.description}</div>
      </div>
      <div className="grid grid-cols-2 items-end whitespace-nowrap">
        <div className="flex gap-1 items-center">
          {hotel.amenities.slice(0, 3).map((amenity) => {
            return (
              <span
                key={amenity}
                className="bg-slate-300 px-2 py-1 rounded-3xl font-bold text-xs whitespace-nowrarp"
              >
                {amenity}
              </span>
            );
          })}

          <p className="text-sm">
            {hotel.amenities.length > 3 &&
              `+${hotel.amenities.length - 3} more`}
          </p>
        </div>
        <div className="flex flex-col items-end gap-8">
          <p className="font-bold">{hotel.pricePerNight}€ per night</p>
          <Link to={`${ERoutes.hoteldetails}/${hotel._id}`}>
            <Button variant={"ringHover"}>Details</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
