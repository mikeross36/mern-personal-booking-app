import { useState, useEffect } from "react";
import { useSearchContext } from "@/hooks";
import { useAppContext } from "@/hooks";
import { useGetHotel } from "@/features/hotel";
import { useParams } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import { useCreatePaymentIntent } from "@/features/hotel";
import BookingDetails from "@/components/BookingDetails";
import BookingInputData from "@/data-input/bookings/BookingInputData";

const stripePubKey = import.meta.env.VITE_STRIPE_PUBKEY as string;

export default function BookingPage() {
  const [numberOfNights, setNumberOfNights] = useState<number>(0);
  const search = useSearchContext();
  const { hotelId } = useParams();
  const { data: hotel } = useGetHotel(hotelId || "");
  const appContext = useAppContext();
  const userInfo = appContext?.state.authUser;
  const stripePromise: Promise<Stripe | null> = loadStripe(
    stripePubKey as string
  );
  const { data: paymentIntentData } = useCreatePaymentIntent(
    hotelId as string,
    numberOfNights.toString()
  );

  useEffect(() => {
    if (search?.checkIn && search?.checkOut) {
      const nights = Math.ceil(
        Math.abs(search.checkOut.getTime() - search.checkIn.getTime()) /
          (24 * 60 * 60 * 1000)
      );
      setNumberOfNights(nights);
    }
  }, [search?.checkIn, search?.checkOut]);

  if (!hotel) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
      <BookingDetails
        checkIn={search?.checkIn || new Date()}
        checkOut={search?.checkOut || new Date()}
        adults={search?.adults || 0}
        kids={search?.kids || 0}
        numberOfNights={numberOfNights}
        hotel={hotel}
      />
      {userInfo && paymentIntentData && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: paymentIntentData.paymentIntentResponse.clientSecret,
          }}
        >
          <BookingInputData
            paymentIntentData={paymentIntentData}
            hotelId={hotelId}
          />
        </Elements>
      )}
    </div>
  );
}
