import { useFormContext } from "react-hook-form";
import { HotelInputDataType } from "@/@types/hotels";
import { amenities } from "./data";

export default function AmenitiesData() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelInputDataType>();

  return (
    <div className="text-zinc-600">
      <h2 className="text-2xl font-bold mb-3 text-center">Amenities</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 p-4 lg:w-2/3 mx-auto">
        {amenities.map((item) => {
          const { id, amenity } = item;
          return (
            <label
              key={id}
              htmlFor={id}
              className="text-[11px] md:text-sm font-bold flex gap-1 text-zinc-600"
            >
              <input
                type="checkbox"
                value={amenity}
                id={id}
                {...register("amenities", {
                  validate: (amenities) => {
                    if (amenities && amenities.length > 0) {
                      return true;
                    } else {
                      return "At least one amenity is required";
                    }
                  },
                })}
              />
              {amenity}
            </label>
          );
        })}
      </div>
      {errors.amenities && (
        <span className="text-red-500">{errors.amenities.message}</span>
      )}
    </div>
  );
}
