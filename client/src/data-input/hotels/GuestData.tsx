import { useFormContext } from "react-hook-form";
import { HotelInputDataType } from "@/@types/hotels";

export default function GuestData() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelInputDataType>();

  return (
    <section className="text-zinc-600">
      <h2 className="text-2xl font-bold mb-3 text-center py-4">Guests</h2>
      <div className="grid grid-cols-2 p-6 gap-5 bg-gray-300 md:w-2/3 mx-auto">
        <label htmlFor="adults" className="text-sm font-semibold">
          Adults
          <input
            type="number"
            id="adults"
            min={1}
            className="border rounded w-full py-2 px-3 font-normal focus:outline-none"
            {...register("adults", { required: "This field is required" })}
          />
          {errors.adults && (
            <span className="text-red-500">{errors.adults.message}</span>
          )}
        </label>
        <label htmlFor="kids" className="text-sm font-semibold">
          Children
          <input
            type="number"
            id="kids"
            min={0}
            className="border rounded w-full py-2 px-3 font-normal focus:outline-none"
            {...register("kids", { required: "This field is required" })}
          />
          {errors.kids && (
            <span className="text-red-500">{errors.kids.message}</span>
          )}
        </label>
      </div>
    </section>
  );
}
