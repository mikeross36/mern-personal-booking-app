import { useMemo } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import { GuestInputDataType } from "@/@types/hotels";
import { useSearchContext } from "@/hooks";
import { useAppContext } from "@/hooks";
import { guestDataSchema } from "@/utils/schemas/guestSchema";
import { useNavigate } from "react-router-dom";
import zod from "zod";
import { ERoutes } from "@/@types/links";

type PropsType = {
  hotelId: string;
  pricePerNight: number;
};

export default function GuestInputData({ hotelId, pricePerNight }: PropsType) {
  const search = useSearchContext();
  const appContext = useAppContext();
  const userInfo = appContext?.state.authUser;
  const navigate = useNavigate();

  const form = useForm<GuestInputDataType>({
    resolver: zodResolver(guestDataSchema),
    defaultValues: {
      checkIn: search?.checkIn,
      checkOut: search?.checkOut,
      adults: search?.adults,
      kids: search?.kids,
    },
  });

  function handleLogin(data: zod.infer<typeof guestDataSchema>) {
    search?.saveSearch({
      destination: "",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.adults,
      kids: data.kids,
    });
    navigate(ERoutes.login);
  }

  function handleFormSubmit(data: zod.infer<typeof guestDataSchema>) {
    search?.saveSearch({
      destination: "",
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      adults: data.adults,
      kids: data.kids,
    });
    navigate(`${ERoutes.hotel}/${hotelId}/booking`);
  }

  const checkIn = form.watch("checkIn");
  const checkOut = form.watch("checkOut");

  const minDate = useMemo(() => new Date(), []);
  const maxDate = useMemo(() => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    return date;
  }, []);

  return (
    <section className="flex flex-col gap-4 p-4 border-2 border-solid border-b-slate-300 text-zinc-600 ">
      <h3 className="text-md font-bold">{pricePerNight}€</h3>
      <Form {...form}>
        <form
          onSubmit={
            userInfo
              ? form.handleSubmit(handleFormSubmit)
              : form.handleSubmit(handleLogin)
          }
        >
          <FormField
            control={form.control}
            name="checkIn"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-in Date:</FormLabel>
                <FormControl>
                  <DatePicker
                    showIcon
                    selected={field.value}
                    onChange={field.onChange}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-in date..."
                    className="min-w-full rounded-md bg-white h-8 md:h-10 focus:outline-none text-xs md:text-base cursor-pointer"
                    wrapperClassName="min-w-full text-xs"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="checkOut"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Check-out Date:</FormLabel>
                <FormControl>
                  <DatePicker
                    showIcon
                    selected={field.value}
                    onChange={field.onChange}
                    selectsStart
                    startDate={checkIn}
                    endDate={checkOut}
                    minDate={minDate}
                    maxDate={maxDate}
                    placeholderText="Check-out date..."
                    className="min-w-full rounded-md bg-white h-8 md:h-10 focus:outline-none text-xs md:text-base cursor-pointer"
                    wrapperClassName="min-w-full text-xs"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adults"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adults:</FormLabel>
                <FormControl>
                  <Input type="number" min={1} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="kids"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Children:</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {userInfo ? (
            <Button type="submit" variant={"ringHover"} className="mt-4">
              Book now
            </Button>
          ) : (
            <Button type="submit" variant={"ringHover"} className="mt-4">
              Login to book
            </Button>
          )}
        </form>
      </Form>
    </section>
  );
}
