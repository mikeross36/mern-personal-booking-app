import { useFormContext } from "react-hook-form";
import { HotelInputDataType } from "@/@types/hotels";
import { Button } from "@/components/ui/button";

export default function ImageData() {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<HotelInputDataType>();

  const existingImageUrls = watch("imageUrls");

  function handleDeleteImage(imageUrl: string) {
    setValue(
      "imageUrls",
      existingImageUrls.filter((url) => url !== imageUrl)
    );
  }

  return (
    <section className="text-zinc-600">
      <h2 className="text-2xl font-bold mb-3">Images</h2>
      <div className="flex flex-col gap-4 border rounded p-4">
        {existingImageUrls && (
          <div className="grid grid-cols-6 gap-4">
            {existingImageUrls.map((url) => {
              return (
                <div key={url} className="relative group">
                  <img
                    src={url}
                    alt="hotel image"
                    className="min-h-full object-cover hover:cursor-pointer"
                  />
                  <Button
                    onClick={() => handleDeleteImage(url)}
                    variant={"destructive"}
                    className="absolute inset-0 bg-opacity-45 opacity-0 group-hover:opacity-100 text-white"
                  >
                    DELETE
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        <input
          type="file"
          multiple
          accept="image/*"
          className="text-zinc-600 font-normal"
          {...register("imageFiles", {
            validate: (imageFiles) => {
              const totalLength =
                imageFiles?.length + (existingImageUrls?.length || 0);
              if (totalLength === 0) {
                return "At least one image should be added";
              }
              if (totalLength > 6) {
                return "Total number of images cannot be more then 6";
              }
              return true;
            },
          })}
        />
        {errors.imageFiles && (
          <span className="text-red-500 text-sm font-bold">
            {errors.imageFiles.message}
          </span>
        )}
      </div>
    </section>
  );
}
