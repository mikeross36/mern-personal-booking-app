import { Request, Response, NextFunction } from "express";
import { searchQueryHandler } from "../utils/searchQuery";
import { HotelModel } from "../models";
import { HotelSearchResponseType, HotelType } from "../@types";
import { logger } from "../utils/logger";
import { validationResult } from "express-validator";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET as string);

export async function searchHotelsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const query = searchQueryHandler(req.query);
    const sortOptionsMap = {
      starRating: { starRating: -1 },
      pricePerNightAsc: { pricePerNight: 1 },
      pricePernightDesc: { pricePerNight: -1 },
    };
    const sortOption = req.query.sortOption as keyof typeof sortOptionsMap;

    function isValidSortOption(option: string) {
      return Object.keys(sortOptionsMap).includes(option);
    }
    const sortOptions = isValidSortOption(sortOption)
      ? sortOptionsMap[sortOption]
      : {};

    const hotelsPerPage = Number(req.query.hotelsPerPage) || 5;
    const pageNumber = Number(
      req.query.currentPage ? req.query.currentPage.toString() : "1"
    );
    const skip = (pageNumber - 1) * hotelsPerPage;
    const hotels = await HotelModel.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(hotelsPerPage);

    const total = await HotelModel.countDocuments(query);

    const searchResponse: HotelSearchResponseType = {
      data: hotels as unknown as HotelType[],
      pagination: {
        totalHotels: total,
        currentPage: pageNumber,
        totalPages: Math.ceil(total / hotelsPerPage),
      },
    };
    return res.status(200).json({ data: { searchResponse } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function getAllHotelsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const hotels = await HotelModel.find().sort("-lastUpdate");
    if (!hotels) {
      return res.status(404).json({ message: "Hotels not found" });
    }
    return res.status(200).json({ result: hotels.length, data: { hotels } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return next(err);
    }
    return next(new Error("A unknown error occurred"));
  }
}

export async function getHotelHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ message: "Bad request", errors: errors.array() });
  }
  try {
    const id = req.params.id.toString();
    const hotel = await HotelModel.findById(id).populate([
      { path: "bookings", strictPopulate: false },
    ]);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    return res.status(200).json({ data: { hotel } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return res.status(500).json({ message: "An unknown error occurred" });
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function createStripePaymentIntent(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { numberOfNights } = req.body;
  const hotelId = req.params.hotelId;
  try {
    const hotel = await HotelModel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }
    const totalCost = hotel.pricePerNight * numberOfNights;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCost * 100,
      currency: "EUR",
      metadata: {
        hotelId: hotelId,
        userId: (req as any).user?._id.toString(),
      },
    });
    const error = paymentIntent.last_payment_error;
    if (error !== null) {
      return res.status(400).json({
        message: `Payment Intent ${paymentIntent.id} experienced a ${error.type} errror`,
      });
    }
    if (!paymentIntent.client_secret) {
      return res
        .status(400)
        .json({ message: "Error creating payment intent. No client secret" });
    }
    const paymentIntentResponse = {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret.toString(),
      totalCost,
    };
    return res
      .status(201)
      .json({ message: "Payment intent created", paymentIntentResponse });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
    }
    next(err);
  }
}
