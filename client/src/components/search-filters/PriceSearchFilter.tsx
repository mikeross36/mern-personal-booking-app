import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { prices } from "@/data-input/hotels/data";

type PropsType = {
  selectedPrice?: number;
  setSelectedPrice: (value?: number) => void;
};

export default function PriceSearchFilter({
  selectedPrice,
  setSelectedPrice,
}: PropsType) {
  return (
    <div>
      <h4 className="text-md font-semibold">Max Price</h4>
      <Select
        defaultValue={selectedPrice?.toString()}
        onValueChange={(value) =>
          setSelectedPrice(value ? Number(value) : undefined)
        }
      >
        <SelectTrigger>
          <SelectValue placeholder="Select max price" />
        </SelectTrigger>
        <SelectContent>
          {prices.map((item) => {
            const { id, price } = item;
            return (
              <SelectItem key={id} value={price.toString()}>
                {price}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
