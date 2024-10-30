import express, { RequestHandler } from "express";
import { tokenProtect } from "../middlewares/tokenProtect";
import { requireUser } from "../middlewares/requireUser";
import { setHotelAndUserIds } from "../middlewares/hotelsUsersIds";
import {
  createNewBookingHandler,
  getAllUserBookingsHandler,
} from "../controllers/bookingController";

const router = express.Router({ mergeParams: true });

router.use(tokenProtect as RequestHandler, requireUser as RequestHandler);

router.post("/", setHotelAndUserIds, createNewBookingHandler as RequestHandler);
router.get("/user-bookings", getAllUserBookingsHandler as RequestHandler);

export default router;
