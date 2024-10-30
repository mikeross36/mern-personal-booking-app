import { useCallback } from "react";
import { HotelResponseType } from "@/@types/hotels";
import { useQuery } from "@tanstack/react-query";
import { getHotel } from "@/api/hotel";
import { createPaymentIntent } from "@/api/hotel";
import { PaymentIntentResponseType } from "@/@types/hotels";

export function useGetHotel(id: string) {
  const memoizedSelect = useCallback(
    (data: HotelResponseType) => data.data.hotel,
    []
  );
  return useQuery({
    queryKey: ["hotels", id],
    queryFn: () => getHotel(id),
    select: memoizedSelect,
  });
}

export function useCreatePaymentIntent(
  hotelId: string,
  numberOfNights: string
) {
  const memoizedSelect = useCallback(
    (data: PaymentIntentResponseType) => data,
    []
  );
  return useQuery({
    queryKey: ["paymentIntent"],
    queryFn: () =>
      createPaymentIntent(hotelId as string, numberOfNights.toString()),
    enabled: !!hotelId && parseInt(numberOfNights) > 0,
    select: memoizedSelect,
  });
}
