import { hotelCategories } from "./data/index";
import { useFormContext } from "react-hook-form";
import { HotelInputDataType } from "@/@types/hotels";

export default function CategoryData() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<HotelInputDataType>();

  const typeWatch = watch("category");

  return (
    <div className="text-zinc-600">
      <h2 className="text-2xl font-bold mb-3 text-center">Categories</h2>
      <div className="grid grid-cols-5 gap-2 py-4 md:w-2/3 m-auto">
        {hotelCategories.map((cat) => {
          const { id, category } = cat;
          return (
            <label
              key={id}
              className={
                typeWatch === category
                  ? "flex items-center justify-center text-center cursor-pointer bg-lime-600 text-white text-[11px] md:text-sm rounded-2xl p-2 font-bold "
                  : "flex items-center justify-center text-center cursor-pointer bg-gray-300 text-[11px] md:text-sm rounded-2xl p-2 font-bold"
              }
            >
              <input
                type="radio"
                value={category}
                {...register("category", {
                  required: "This field is required",
                })}
                className="hidden"
              />
              <span>{category}</span>
            </label>
          );
        })}
      </div>
      {errors.category && <span role="alert" className="text-red-500"></span>}
    </div>
  );
}
