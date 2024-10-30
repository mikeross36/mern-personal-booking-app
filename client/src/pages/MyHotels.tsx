import { useGetMyHotels } from "@/features/myHotels";
import { Link } from "react-router-dom";
import { ERoutes } from "@/@types/links";
import { Button } from "@/components/ui/button";
import Hotel from "@/components/Hotel";

export default function MyHotels() {
  const { data: myHotels } = useGetMyHotels();

  return (
    <section className="space-y-5 text-zinc-600">
      <span className="flex justify-between">
        {myHotels?.length === 0 ? (
          <h1 className="text-3xl font-bold">No Hotels Found</h1>
        ) : (
          <h1 className="text-3xl font-bold">My Hotels</h1>
        )}
        <Link to={ERoutes.addhotel}>
          <Button variant={"ringHover"}>Add Hotel</Button>
        </Link>
      </span>
      <div className="grid gap-8">
        {myHotels?.map((hotel) => {
          return <Hotel key={hotel._id} hotel={hotel} />;
        })}
      </div>
    </section>
  );
}
