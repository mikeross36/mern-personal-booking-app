import { amenities } from "@/data-input/hotels/data";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type PropsType = {
  selectedAmenities: string[];
  handleAmenitiesFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function AmenitySearchFilter({
  selectedAmenities,
  handleAmenitiesFilter,
}: PropsType) {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Amenities</h4>
      {amenities.map((item) => {
        const { id, amenity } = item;
        return (
          <div key={id} className="flex items-center space-x-2 py-2">
            <Checkbox
              id={`amenity-${amenity}`}
              value={amenity}
              checked={selectedAmenities.includes(amenity)}
              onCheckedChange={(checked) =>
                handleAmenitiesFilter({
                  target: { value: amenity, checked },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            />
            <Label
              htmlFor={`amenity-${amenity}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
            >
              {amenity}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
