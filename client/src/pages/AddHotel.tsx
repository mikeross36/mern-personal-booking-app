import ManageHotelData from "@/data-input/hotels/ManageHotelData";
import { useAddMyHotel } from "@/features/myHotels";

export default function AddHotel() {
  const { mutateAsync: addHotelAction, isPending } = useAddMyHotel();

  function handleSaveHotelData(hotelFormData: FormData) {
    addHotelAction({ hotelFormData });
  }

  return (
    <ManageHotelData
      handleSaveHotelData={handleSaveHotelData}
      isPending={isPending}
    />
  );
}
