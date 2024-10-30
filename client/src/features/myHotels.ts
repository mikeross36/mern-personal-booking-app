import { useCallback } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  addMyHotel,
  getMyHotels,
  getMyHotel,
  updateMyHotel,
} from "@/api/myHotels";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ERoutes } from "@/@types/links";
import { HotelResponseType } from "@/@types/hotels";

export function useAddMyHotel() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ hotelFormData }: { hotelFormData: FormData }) =>
      addMyHotel(hotelFormData),
    onSuccess: () => {
      toast.success("New hotel successfully added");
      queryClient.invalidateQueries({ queryKey: ["myHotels"] });
      navigate(ERoutes.myhotels);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}

export function useGetMyHotels() {
  const memoizedSelect = useCallback(
    (data: HotelResponseType) => data.data.hotels,
    []
  );
  return useQuery({
    queryKey: ["myHotels"],
    queryFn: () => getMyHotels(),
    select: memoizedSelect,
  });
}

export function useGetMyHotel(id: string) {
  const memoizedSelect = useCallback(
    (data: HotelResponseType) => data.data.hotel,
    []
  );
  return useQuery({
    queryKey: ["myHotels"],
    queryFn: () => getMyHotel(id),
    select: memoizedSelect,
  });
}

export function useUpdateMyHotel() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ hotelFormData }: { hotelFormData: FormData }) =>
      updateMyHotel(hotelFormData),
    onSuccess: () => {
      toast.success("Hotel successfully updated");
      queryClient.invalidateQueries({ queryKey: ["myHotels"] });
      navigate(ERoutes.myhotels);
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
}
