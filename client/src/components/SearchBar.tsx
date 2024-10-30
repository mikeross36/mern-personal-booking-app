import { useState, useMemo } from "react";
import { useSearchContext } from "@/hooks";
import { MapPinned } from "lucide-react";
import { SearchContextType } from "@/contexts/SearchContextProvider";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "@/@types/links";

export default function SearchBar() {
  const search = useSearchContext() as SearchContextType;
  const navigate = useNavigate();

  const [destination, setDestination] = useState<string>(
    search.destination || ""
  );
  const [checkIn, setCheckIn] = useState<Date>(search.checkIn || new Date());
  const [checkOut, setCheckOut] = useState<Date>(search.checkOut || new Date());
  const [adults, setAdults] = useState<number>(search.adults || 1);
  const [kids, setKids] = useState<number>(search.kids || 0);

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    search.saveSearch({
      destination,
      checkIn,
      checkOut,
      adults,
      kids,
    });
    navigate(ERoutes.search);
  }

  function deleteSearch() {
    sessionStorage.clear();
    window.location.reload();
  }

  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }, []);

  return (
    <form
      onSubmit={handleFormSubmit}
      className="-mt-9 md:-mt-10 lg:-mt-7 p-2 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4"
    >
      <div className="flex items-center flex-1 bg-white p-1 md:p-2 rounded-md">
        <MapPinned size={25} className="mr-2" />
        <input
          type="text"
          className="w-full focus:outline-none text-sm md:text-base"
          placeholder="where are you going..."
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
        />
      </div>
      <div className="flex bg-white p-1 gap-1 md:gap-2 rounded-md">
        <label
          htmlFor="adults"
          className="flex items-center text-xs md:text-base"
        >
          Adults:
          <input
            type="number"
            id="adults"
            className="w-full p-1 focus:outline-none font-bold"
            min={1}
            max={20}
            value={adults}
            onChange={(e) => setAdults(parseInt(e.target.value))}
          />
        </label>
        <label
          htmlFor="kids"
          className="flex items-center text-xs md:text-base"
        >
          Children:
          <input
            type="number"
            id="kids"
            className="w-full p-1 focus:outline-none font-bold"
            min={0}
            max={20}
            value={kids}
            onChange={(e) => setKids(parseInt(e.target.value))}
          />
        </label>
      </div>
      <div>
        <DatePicker
          showIcon
          selected={checkIn}
          onChange={(date) => setCheckIn(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in date..."
          className="min-w-full rounded-md bg-white h-8 md:h-10 focus:outline-none text-xs md:text-base cursor-pointer"
          wrapperClassName="min-w-full text-xs"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
      <div>
        <DatePicker
          showIcon
          selected={checkOut}
          onChange={(date) => setCheckOut(date as Date)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={minDate}
          maxDate={maxDate}
          placeholderText="Check-in date..."
          className="min-w-full rounded-md bg-white h-8 md:h-10 focus:outline-none text-xs md:text-base cursor-pointer"
          wrapperClassName="min-w-full text-xs"
          dateFormat="MMMM d, yyyy h:mm aa"
        />
      </div>
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant={"ringHover"}
          className="w-full md:w-1/3 bg-white text-zinc-600 hover:text-white"
        >
          Search
        </Button>
        <Button
          onClick={deleteSearch}
          variant={"ringHover"}
          className="w-full md:w-1/3 bg-red-600 text-white"
        >
          Clear
        </Button>
      </div>
    </form>
  );
}
