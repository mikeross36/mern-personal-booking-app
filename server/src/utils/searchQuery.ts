export function searchQueryHandler(queryParams: Record<string, any>) {
  let searchQuery: Record<string, any> = {};

  if (queryParams.destination) {
    searchQuery.$or = [
      { city: new RegExp(queryParams.destination, "i") },
      { country: new RegExp(queryParams.destination, "i") },
    ];
  }
  if (queryParams.adults) {
    searchQuery.adults = {
      $gte: Number(queryParams.adults),
    };
  }
  if (queryParams.kids) {
    searchQuery.kids = {
      $gte: Number(queryParams.kids),
    };
  }
  if (queryParams.stars) {
    const starRatings = Array.isArray(queryParams.stars)
      ? queryParams.stars.map((star: string) => Number(star))
      : Number(queryParams.stars);

    searchQuery.starRating = { $in: starRatings };
  }
  if (queryParams.category) {
    searchQuery.category = {
      $in: Array.isArray(queryParams.category)
        ? queryParams.category
        : [queryParams.category],
    };
  }
  if (queryParams.amenities) {
    searchQuery.amenities = {
      $all: Array.isArray(queryParams.amenities)
        ? queryParams.amenities
        : [queryParams.amenities],
    };
  }
  if (queryParams.maxPrice) {
    searchQuery.pricePerNight = {
      $lte: Number(queryParams.maxPrice).toString(),
    };
  }

  return searchQuery;
}
