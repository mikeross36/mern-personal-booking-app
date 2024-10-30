import { HotelResponseType } from "@/@types/hotels";
import { HotelType } from "../../../server/src/@types";
import { apiClient } from "./apiClient";

export async function addMyHotel(hotelFormData: FormData): Promise<HotelType> {
  return (
    await apiClient.post("/my-hotels", hotelFormData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
  ).data;
}

export async function getMyHotels() {
  return (await apiClient.get<HotelResponseType>("/my-hotels")).data;
}

export async function getMyHotel(id: string) {
  return (await apiClient.patch<HotelResponseType>(`/my-hotels/${id}`)).data;
}

export async function updateMyHotel(
  hotelFormData: FormData
): Promise<HotelType> {
  return (
    await apiClient.patch(
      `/my-hotels/${hotelFormData.get("hotelId")}`,
      hotelFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    )
  ).data;
}
