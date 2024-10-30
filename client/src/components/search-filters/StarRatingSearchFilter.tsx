import { stars } from "@/data-input/hotels/data";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type PropsType = {
  selectedStars: string[];
  handleStarRatingFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function StarRatingSearchFilter({
  selectedStars,
  handleStarRatingFilter,
}: PropsType) {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">Hotel Rating</h4>
      {stars.map((item) => {
        const { id, star } = item;
        return (
          <div key={id} className="flex items-center space-x-2 py-2">
            <Checkbox
              id={`star-${star}`}
              value={star}
              checked={selectedStars.includes(star)}
              onCheckedChange={(checked) => {
                handleStarRatingFilter({
                  target: { value: star, checked },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            <Label
              htmlFor={`star-${star}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
            >
              {star} stars
            </Label>
          </div>
        );
      })}
    </div>
  );
}
