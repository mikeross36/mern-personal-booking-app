import express, { RequestHandler } from "express";
import { tokenProtect } from "../middlewares/tokenProtect";
import { requireUser } from "../middlewares/requireUser";
import { body, param } from "express-validator";
import {
  upload,
  createMyHotelHandler,
  getMyHotelsHandler,
  getMyHotelHandler,
  updateMyHotelHandler,
} from "../controllers/myHotelsController";

const router = express.Router();

router.use(tokenProtect as RequestHandler, requireUser as RequestHandler);

router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Hotel name is required"),
    body("city").notEmpty().withMessage("City is required"),
    body("country").notEmpty().withMessage("Country is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("category").notEmpty().withMessage("Hotel category is required"),
    body("Price per night")
      .notEmpty()
      .isNumeric()
      .withMessage("Price is required and must be a number"),
    body("amenities")
      .notEmpty()
      .isArray()
      .withMessage("Amenities are required"),
  ],
  upload.array("imageFiles", 6),
  createMyHotelHandler as RequestHandler
);

router.get("/", getMyHotelsHandler as RequestHandler);

router.get(
  "/:id",
  [param("id").notEmpty().withMessage("Hotel ID is required")],
  getMyHotelHandler as RequestHandler
);

router.patch(
  "/:hotelId",
  [param("hotelId").notEmpty().withMessage("Hotel ID is required")],
  updateMyHotelHandler as RequestHandler
);

export default router;
