import express, { RequestHandler } from "express";
import {
  getAllHotelsHandler,
  getHotelHandler,
  searchHotelsHandler,
  createStripePaymentIntent,
} from "../controllers/hotelController";
import { param, body } from "express-validator";
import bookingRouter from "./bookingRoutes";
import { tokenProtect } from "../middlewares/tokenProtect";
import { requireUser } from "../middlewares/requireUser";

const router = express.Router({ mergeParams: true });

router.use("/:hotelId/bookings", bookingRouter);

router.get("/search", searchHotelsHandler as RequestHandler);
router.get("/", getAllHotelsHandler as RequestHandler);
router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  getHotelHandler as RequestHandler
);

router.post(
  "/:hotelId/payment-intent",
  [
    param("hotelId").notEmpty().withMessage("Hotel ID is required"),
    body("numberOfNights")
      .notEmpty()
      .withMessage("Number of nights is required"),
  ],
  tokenProtect as RequestHandler,
  requireUser as RequestHandler,
  createStripePaymentIntent as RequestHandler
);

export default router;
