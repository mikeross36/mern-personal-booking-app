import { hotelCategories } from "@/data-input/hotels/data";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";

type PropsType = {
  selectedCategory: string[];
  handleCategoryFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function CategorySearchFilter({
  selectedCategory,
  handleCategoryFilter,
}: PropsType) {
  return (
    <div className="border-b border-slate-300 pb-5">
      <h4 className="text-md font-semibold mb-2">HotelCategory</h4>
      {hotelCategories.map((item) => {
        const { id, category } = item;
        return (
          <div key={id} className="flex items-center space-x-2 py-2">
            <Checkbox
              id={`category-${category}`}
              value={category}
              checked={selectedCategory.includes(category)}
              onCheckedChange={(checked) => {
                handleCategoryFilter({
                  target: { value: category, checked },
                } as React.ChangeEvent<HTMLInputElement>);
              }}
            />
            <Label
              htmlFor={`category-${category}`}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed"
            >
              {category}
            </Label>
          </div>
        );
      })}
    </div>
  );
}
