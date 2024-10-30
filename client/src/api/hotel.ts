import {
  HotelSearchParamsType,
  PaymentIntentResponseType,
} from "@/@types/hotels";
import { HotelSearchResponseType } from "../../../server/src/@types";
import { apiClient } from "./apiClient";

export async function searchHotels(
  searchParams: HotelSearchParamsType
): Promise<HotelSearchResponseType> {
  try {
    const {
      destination,
      checkIn,
      checkOut,
      adults,
      kids,
      currentPage,
      maxPrice,
      sortOption,
    } = searchParams;

    const queryParams = new URLSearchParams();

    function appendParam(key: string, value?: string) {
      if (value) {
        queryParams.append(key, value);
      }
    }

    appendParam("destination", destination);
    appendParam("checkIn", checkIn);
    appendParam("checkOut", checkOut);
    appendParam("adults", adults);
    appendParam("kids", kids);
    appendParam("currentPage", currentPage);
    appendParam("maxPrice", maxPrice);
    appendParam("sortOption", sortOption);

    (searchParams.stars ?? []).forEach((star) =>
      queryParams.append("stars", star)
    );
    (searchParams.category ?? []).forEach((cat) =>
      queryParams.append("category", cat)
    );
    (searchParams.amenities ?? []).forEach((amenity) =>
      queryParams.append("amenities", amenity)
    );

    return (await apiClient.get(`/hotels/search?/${queryParams}`)).data.data
      .searchResponse;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
    throw new Error("An unknown error occurred");
  }
}

export async function getAllHotels() {
  return (await apiClient.get("/hotels")).data;
}

export async function getHotel(id: string) {
  return (await apiClient.get(`/hotels/${id}`)).data;
}

export async function createPaymentIntent(
  hotelId: string,
  numberOfNights: string
): Promise<PaymentIntentResponseType> {
  return (
    await apiClient.post(`/hotels/${hotelId}/payment-intent`, {
      numberOfNights,
    })
  ).data;
}
