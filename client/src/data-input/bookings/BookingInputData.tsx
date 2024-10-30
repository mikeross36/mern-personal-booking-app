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
import { BookingDataType } from "@/@types/bookings";
import { useAppContext } from "@/hooks";
import { useSearchContext } from "@/hooks";
import { PaymentIntentResponseType } from "@/@types/hotels";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { StripeCardElement } from "@stripe/stripe-js";
import { useCreateBooking } from "@/features/booking";
import { toast } from "react-toastify";

type PropsType = {
  paymentIntentData: PaymentIntentResponseType;
  hotelId: string | undefined;
};

export default function BookingInputData({
  paymentIntentData,
  hotelId,
}: PropsType) {
  const appContext = useAppContext();
  const userInfo = appContext?.state.authUser;
  const search = useSearchContext();
  const stripe = useStripe();
  const elements = useElements();
  const { mutateAsync: createBookingAction, isPending } = useCreateBooking();

  const form = useForm<BookingDataType>({
    defaultValues: {
      userName: userInfo?.userName,
      email: userInfo?.email,
      adults: search?.adults,
      kids: search?.kids,
      checkIn: search?.checkIn.toISOString(),
      checkOut: search?.checkOut.toISOString(),
      hotelId: hotelId,
      paymentIntentId: paymentIntentData.paymentIntentResponse.paymentIntentId,
      totalCost: paymentIntentData.paymentIntentResponse.totalCost,
    },
  });

  async function handleFormSubmit(formData: BookingDataType) {
    try {
      const result = await stripe?.confirmCardPayment(
        paymentIntentData?.paymentIntentResponse.clientSecret,
        {
          payment_method: {
            card: elements?.getElement(CardElement) as StripeCardElement,
          },
        }
      );
      console.log(result);
      if (result?.paymentIntent?.status === "succeeded") {
        createBookingAction({
          hotelId: formData.hotelId,
          formData: {
            ...formData,
            paymentIntentId: result.paymentIntent.id,
          },
        });
      } else {
        toast.error("Payment failed!");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(`Error submit booking: ${err.message}`);
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="grid gap-5 rounded-lg border border-slate-300 p-5"
      >
        <h2 className="text-3xl font-bold">Confirm Your Details</h2>
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UserName</FormLabel>
              <FormControl>
                <Input type="text" placeholder="user name..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>UserName</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Your Price Summary</h3>
          <div className="bg-blue-200 p-4 rounded-md">
            <p className="font-semibold text-lg">Total Cost: €</p>
            <p className="text-sm">Include taxes and charges</p>
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl">Payment Details</h3>
          <CardElement
            id="payment-element"
            className="border rounded-md p-2 text-sm"
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" variant={"secondary"} disabled={isPending}>
            Confirm
          </Button>
        </div>
      </form>
    </Form>
  );
}
