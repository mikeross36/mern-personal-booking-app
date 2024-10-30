import { useFormContext } from "react-hook-form";
import { HotelInputDataType } from "@/@types/hotels";

export default function InfoData() {
  const {
    register,
    formState: { errors },
  } = useFormContext<HotelInputDataType>();
  return (
    <section className="flex flex-col gap-4 md:w-2/3 m-auto text-zinc-600">
      <h1 className="text-3xl font-bold mg-3 text-center">Add Hotel</h1>
      <label htmlFor="name" className="text-sm font-bold flex-1">
        Name{" "}
        <input
          type="text"
          id="name"
          className="border rounded w-full py-1 px-2 font-normal focus:outline-none"
          autoComplete="off"
          {...register("name", { required: "This field is required" })}
        />
        {errors.name && (
          <span role="alert" className="text-red-500">
            {errors.name.message}
          </span>
        )}
      </label>
      <div className="flex gap-4">
        <label htmlFor="city" className="text-sm font-bold flex-1">
          City{" "}
          <input
            type="text"
            id="city"
            autoComplete="off"
            className="border rounded w-full py-1 px-2 font-normal focus:outline-none"
            {...register("city", { required: "This field is required" })}
          />
          {errors.city && (
            <span role="alert" className="text-red-500">
              {errors.city.message}
            </span>
          )}
        </label>
        <label htmlFor="country" className="text-sm font-bold flex-1">
          Contry{" "}
          <input
            type="text"
            id="country"
            autoComplete="off"
            className="border rounded w-full py-1 px-2 font-normal focus:outline-none"
            {...register("country", { required: "This field is required" })}
          />
          {errors.country && (
            <span role="alert" className="text-red-500">
              {errors.country.message}
            </span>
          )}
        </label>
      </div>
      <label htmlFor="description" className="text-sm font-bold flex-1">
        Description
        <textarea
          id="description"
          rows={10}
          className="border rounded w-full py-1 px-2 font-normal focus:outline-none"
          autoComplete="off"
          {...register("description", { required: "This field is required" })}
        />
        {errors.description && (
          <span role="alert" className="text-red-500">
            {errors.description.message}
          </span>
        )}
      </label>
      <label htmlFor="pricePerNight" className="text-sm font-bold flex-1">
        Price Per Night
        <input
          type="number"
          min={1}
          id="pricePerNight"
          autoComplete="off"
          className="border rounded w-full py-1 px-2 font-normal focus:outline-none"
          {...register("pricePerNight", { required: "This field is required" })}
        />
        {errors.pricePerNight && (
          <span role="alert" className="text-red-500">
            {errors.pricePerNight.message}
          </span>
        )}
      </label>
      <label htmlFor="starRating" className="text-sm font-bold flex-1">
        Start Rating
        <select
          id="starRating"
          className="border rounded w-full p-2 font-normal"
          {...register("starRating", { required: "This field is required" })}
        >
          <option value="" className="text-sm font-bold">
            Select as Rating
          </option>
          {[1, 2, 3, 4, 5].map((num, idx) => {
            return (
              <option key={idx} value={num} className="font-bold">
                {num}
              </option>
            );
          })}
        </select>
        {errors.starRating && (
          <span role="alert" className="text-red-500">
            {errors.starRating.message}
          </span>
        )}
      </label>
    </section>
  );
}
