import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import { BookingModel } from "../models";
import { logger } from "../utils/logger";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export async function createNewBookingHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info(req.body.paymentIntentId);
  try {
    const paymentIntentId = req.body.paymentIntentId;
    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId as string
    );
    if (!paymentIntent) {
      return res.status(404).json({ message: "Payment intent not found" });
    }
    const error = paymentIntent.last_payment_error;
    if (error !== null) {
      return res.status(400).json({
        message: `Payment intent ${paymentIntent.id} expierenced a ${error.type} error`,
      });
    }
    if (
      paymentIntent.metadata.hotelId !== req.params.hotelId ||
      paymentIntent.metadata.userId !== (req as any).user?._id.toString()
    ) {
      return res.status(400).json({
        message: `Failed to create payment intent. Status: ${paymentIntent.status}`,
      });
    }
    const booking = await BookingModel.create(req.body);
    if (!booking) {
      return res
        .status(400)
        .json({ message: "Failed to create booking. Invalid data passed" });
    }
    return res
      .status(201)
      .json({ message: "Booking added", data: { booking } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function getAllUserBookingsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const bookings = await BookingModel.find({ user: res.locals.user });
    if (!bookings) {
      return res.status(404).json({ message: "User's bookings not found" });
    }
    return res
      .status(200)
      .json({ result: bookings.length, data: { bookings } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}
