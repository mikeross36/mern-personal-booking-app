import { useState } from "react";
import { useSearchContext } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import { searchHotels } from "@/api/hotel";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import StarRatingSearchFilter from "@/components/search-filters/StarRatingSearchFilter";
import AmenitySearchFilter from "@/components/search-filters/AmenitySearchFilter";
import CategorySearchFilter from "@/components/search-filters/CategorySearchFilter";
import PriceSearchFilter from "@/components/search-filters/PriceSearchFilter";
import SearchResult from "@/components/SearchResult";
import Pagination from "@/components/Pagination";

export default function SearchPage() {
  const [selectedStars, setSelectedStars] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>();
  const [sortOption, setSortOption] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const search = useSearchContext();

  const searchParams = {
    destination: search?.destination,
    checkIn: search?.checkIn.toISOString(),
    checkOut: search?.checkOut.toISOString(),
    adults: search?.adults.toString(),
    kids: search?.kids.toString(),
    stars: selectedStars,
    category: selectedCategory,
    amenities: selectedAmenities,
    maxPrice: selectedPrice?.toString(),
    sortOption,
    currentPage: currentPage.toString(),
  };

  function handleStarRatingFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const starRating = e.target.value;
    setSelectedStars((prevStars) =>
      e.target.checked
        ? [...prevStars, starRating]
        : prevStars.filter((star) => star !== starRating)
    );
  }

  function handleCategoryFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const hotelCategory = e.target.value;
    setSelectedCategory((prevCategory) =>
      e.target.checked
        ? [...prevCategory, hotelCategory]
        : prevCategory.filter((category) => category !== hotelCategory)
    );
  }

  function handleAmenitiesFilter(e: React.ChangeEvent<HTMLInputElement>) {
    const hotelAmenities = e.target.value;
    setSelectedAmenities((prevAmenities) =>
      e.target.checked
        ? [...prevAmenities, hotelAmenities]
        : prevAmenities.filter((amenities) => amenities !== hotelAmenities)
    );
  }

  const { data: hotelData } = useQuery({
    queryKey: ["hotels", searchParams],
    queryFn: () => searchHotels(searchParams),
  });
  // console.log(hotelData);

  return (
    <section className="grid lg:grid-cols-[250px_1fr] gap-5 h-full text-zinc-600">
      <div className="rounded-lg border border-slate-300 p-5 h-fit lg:sticky top-10">
        <div className="space-y-5">
          <h3 className="text-lg font-semibold border-b border-slate-300 pb-5">
            Filter By
          </h3>
          <StarRatingSearchFilter
            selectedStars={selectedStars}
            handleStarRatingFilter={handleStarRatingFilter}
          />
          <CategorySearchFilter
            selectedCategory={selectedCategory}
            handleCategoryFilter={handleCategoryFilter}
          />
          <AmenitySearchFilter
            selectedAmenities={selectedAmenities}
            handleAmenitiesFilter={handleAmenitiesFilter}
          />
          <PriceSearchFilter
            selectedPrice={selectedPrice}
            setSelectedPrice={(value?: number) => setSelectedPrice(value)}
          />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <span className="text-xl font-bold">
            {hotelData?.pagination.totalHotels} Hotel(s) found
            {search?.destination ? `in ${search.destination}` : ""}
          </span>
          <Select
            defaultValue={sortOption}
            onValueChange={(value) => setSortOption(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="starRating">Start Rating</SelectItem>
              <SelectItem value="pricePerNightAsc">
                Price Per Night (ascending)
              </SelectItem>
              <SelectItem value="pricePerNightDesc">
                Price Per Night (descending)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {hotelData?.data.map((hotel) => {
          return <SearchResult key={hotel._id} hotel={hotel} />;
        })}
        <div>
          <Pagination
            currentPage={hotelData?.pagination.currentPage || 1}
            totalPages={hotelData?.pagination.totalPages || 1}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
}
