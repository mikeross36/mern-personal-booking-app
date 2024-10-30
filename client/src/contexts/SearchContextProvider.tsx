import { createContext, useEffect, useState } from "react";

type SearchParamsType = {
  destination: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  kids: number;
  hotelId?: string;
};

export type SearchContextType = SearchParamsType & {
  saveSearch: (params: SearchParamsType) => void;
};

export const SearchContext = createContext<SearchContextType | undefined>(
  undefined
);

export function SearchContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  const [checkIn, setCheckIn] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
  );
  const [checkOut, setCheckOut] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkOut") || new Date().toISOString())
  );
  const [adults, setAdults] = useState<number>(() =>
    Number(sessionStorage.getItem("adults") || "1")
  );
  const [kids, setKids] = useState<number>(() =>
    Number(sessionStorage.getItem("kids") || "0")
  );
  const [hotelId, setHotelId] = useState<string>(
    () => sessionStorage.getItem("hotelId") || ""
  );

  useEffect(() => {
    const searchParams = {
      destination,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      adults: adults.toString(),
      kids: kids.toString(),
      hotelId: hotelId || undefined,
    };
    sessionStorage.setItem("searchParams", JSON.stringify(searchParams));
  }, [destination, checkIn, checkOut, adults, kids, hotelId]);

  function saveSearch(params: SearchParamsType) {
    setDestination(params.destination);
    setCheckIn(params.checkIn);
    setCheckOut(params.checkOut);
    setAdults(params.adults);
    setKids(params.kids);
    if (params.hotelId) {
      setHotelId(params.hotelId);
    }
  }

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        adults,
        kids,
        hotelId,
        saveSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
