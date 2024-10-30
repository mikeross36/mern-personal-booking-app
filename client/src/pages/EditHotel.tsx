import ManageHotelData from "@/data-input/hotels/ManageHotelData";
import { useParams } from "react-router-dom";
import { useGetMyHotel, useUpdateMyHotel } from "@/features/myHotels";

export default function EditHotel() {
  const { hotelId } = useParams();
  const { data: myHotel } = useGetMyHotel(hotelId || "");
  const { mutateAsync: updateMyHotelAction, isPending } = useUpdateMyHotel();

  function handleSaveHotelData(hotelFormData: FormData) {
    updateMyHotelAction({ hotelFormData });
  }

  return (
    <ManageHotelData
      myHotel={myHotel}
      handleSaveHotelData={handleSaveHotelData}
      isPending={isPending}
    />
  );
}
