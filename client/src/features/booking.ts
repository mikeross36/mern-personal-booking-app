import { useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createBooking, getAllUserBookings } from "@/api/booking";
import { BookingDataType, BookingResponseType } from "@/@types/bookings";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "@/@types/links";

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({
      hotelId,
      formData,
    }: {
      hotelId: string;
      formData: BookingDataType;
    }) => createBooking(hotelId, formData),
    onSuccess: async (data) => {
      toast.success(data.data.message);
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate(ERoutes.mybookings);
    },
    onError: (err) => {
      toast.error(`Error adding booking: ${err.message}`);
    },
  });
}

export function useGetAllUserBookings() {
  const memoizedSelect = useCallback(
    (data: BookingResponseType) => data.data.bookings,
    []
  );
  return useQuery({
    queryKey: ["bookings"],
    queryFn: () => getAllUserBookings(),
    select: memoizedSelect,
  });
}
