import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { HotelInputDataType } from "@/@types/hotels";
import { HotelType } from "../../../../server/src/@types";
import { Button } from "@/components/ui/button";
import InfoData from "./InfoData";
import CategoryData from "./CategoryData";
import AmenitiesData from "./AmenitiesData";
import GuestData from "./GuestData";
import ImageData from "./ImageData";

type PropsType = {
  handleSaveHotelData: (hoteFormData: FormData) => void;
  isPending: boolean;
  myHotel?: HotelType;
};

export default function ManageHotelData({
  handleSaveHotelData,
  isPending,
  myHotel,
}: PropsType) {
  const formMethods = useForm<HotelInputDataType>({
    mode: "onChange",
  });

  const { handleSubmit, reset } = formMethods;

  useEffect(() => {
    reset(myHotel);
  }, [myHotel, reset]);

  function handleFormSubmit(data: HotelInputDataType) {
    const formData = new FormData();
    if (myHotel) {
      formData.append("hotelId", myHotel._id);
    }
    formData.append("name", data.name);
    formData.append("city", data.city);
    formData.append("country", data.country);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("pricePerNight", data.pricePerNight.toString());
    formData.append("starRating", data.starRating.toString());
    formData.append("adults", data.adults.toString());
    formData.append("kids", data.kids.toString());

    data.amenities.forEach((amenity, idx) => {
      formData.append(`amenities[${idx}]`, amenity);
    });

    if (data.imageUrls) {
      data.imageUrls.forEach((url, idx) => {
        formData.append(`imageUrls[${idx}]`, url);
      });
    }

    Array.from(data.imageFiles).forEach((imageFile) => {
      formData.append("imageFiles", imageFile);
    });

    handleSaveHotelData(formData);
  }

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={handleSubmit(handleFormSubmit)}
        className="flex flex-col gap-10"
      >
        <InfoData />
        <CategoryData />
        <AmenitiesData />
        <GuestData />
        <ImageData />
        <div className="flex justify-center">
          <Button variant={"ringHover"}>{isPending ? "Pending" : "ADD"}</Button>
        </div>
      </form>
    </FormProvider>
  );
}
