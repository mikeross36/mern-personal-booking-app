import { HotelType } from "../../../server/src/@types";
import { MapPin, House, Banknote, PersonStanding, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { ERoutes } from "@/@types/links";
import { Button } from "./ui/button";

export default function Hotel({ hotel }: { hotel: HotelType }) {
  return (
    <div className="flex flex-col justify-between gap-5 border border-slate-300 rounded-lg p-8 ">
      <h2 className="text-2xl font-bold">{hotel.name}</h2>
      <p className="whitespace-pre-line">{hotel.description}</p>
      <article className="grid grid-cols-3 md:grid-cols-5 gap-1 md:gap-2">
        <div className="flex flex-wrap items-center justify-center md:justify-normal text-xs lg:text-sm border border-slate-300 rounded-sm p-3">
          <MapPin size={24} className="mr-1" />
          <span className="flex flex-wrap justify-center md:justify-normal gap-2">
            <p>{hotel.city},</p>
            <p>{hotel.country}</p>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-normal text-xs lg:text-base border border-slate-300 rounded-sm p-3">
          <House size={24} className="mr-1" />
          <p>{hotel.category}</p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-normal text-xs lg:text-base border border-slate-300 rounded-sm p-3">
          <Banknote size={24} className="mr-1" />
          <p>{hotel.pricePerNight}€ per night</p>
        </div>
        <div className="flex flex-wrap items-center justify-center md:justify-normal text-xs lg:text-base border border-slate-300 rounded-sm p-3">
          <PersonStanding size={24} className="mr-1" />
          <span className="flex flex-wrap gap-2">
            {" "}
            <p>{hotel.adults} adults</p>
            <p>{hotel.kids} children</p>
          </span>
        </div>
        <div className="flex flex-wrap items-center justify-center  text-xs lg:text-base border border-slate-300 rounded-sm p-3">
          {[...Array(hotel.starRating).keys()].map((_, idx) => {
            return (
              <Star
                key={idx}
                size={24}
                strokeWidth={0.5}
                className="fill-yellow-400"
              />
            );
          })}
        </div>
      </article>
      <span className="flex justify-end">
        <Link to={`${ERoutes.edithotel}/${hotel._id}`}>
          <Button variant={"ringHover"}>Edit Hotel</Button>
        </Link>
      </span>
    </div>
  );
}
