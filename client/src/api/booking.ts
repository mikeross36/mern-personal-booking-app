import { BookingDataType } from "@/@types/bookings";
import { apiClient } from "./apiClient";

export async function createBooking(
  hotelId: string,
  formData: BookingDataType
) {
  return await apiClient.post(
    `/hotels/${hotelId}/bookings`,
    JSON.stringify(formData)
  );
}

export async function getAllUserBookings() {
  return (await apiClient.get("/bookings/user-bookings")).data;
}
