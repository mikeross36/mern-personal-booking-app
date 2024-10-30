import { Request, Response, NextFunction } from "express";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { logger } from "../utils/logger";
import { HotelType } from "../@types";
import { validationResult } from "express-validator";
import { HotelModel } from "../models";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
  },
});

async function uploadImages(imageFiles: Express.Multer.File[]) {
  try {
    if (imageFiles.length === 0) return [];
    const uploadPromises = imageFiles.map(async (image) => {
      const b64 = Buffer.from(image.buffer).toString("base64");
      let dataUri = "data:" + image.mimetype + ";base64," + b64;
      const cldRes = await cloudinary.uploader.upload(dataUri);
      return cldRes.url;
    });
    const imageUrls = await Promise.all(uploadPromises);
    return imageUrls;
  } catch (err) {
    if (err instanceof Error) {
      logger.error(`Failed to upload image: ${err.message}`);
    }
  }
}

export async function createMyHotelHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ message: errors.array() });
  // }
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const imageUrls = await uploadImages(imageFiles);
    const newHotel: HotelType = req.body;

    newHotel.imageUrls = imageUrls || [];
    newHotel.lastUpdate = new Date();
    newHotel.user = res.locals.user;

    const hotel = await HotelModel.create(newHotel);
    if (!hotel) {
      return res
        .status(400)
        .json({ message: "Failed to add new hotel. Invalid data passed" });
    }
    return res
      .status(201)
      .json({ message: "New Hotel successfully added", data: { hotel } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return res.status(500).json({ message: "An unknown error occurred" });
    }
    return next(new Error("An anknown error occurred"));
  }
}

export async function getMyHotelsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const hotels = await HotelModel.find({ user: res.locals.user });
    if (!hotels) {
      return res.status(404).json({ message: "Hotels not found" });
    }
    return res.status(200).json({ result: hotels.length, data: { hotels } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return res.status(500).json({ message: "An unknown error occurred" });
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function getMyHotelHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const id = req.params.id.toString();
    const hotel = await HotelModel.findOne({ _id: id, user: res.locals.user });
    if (!hotel) {
      return res.status(404).json({ message: "User's hotel not found" });
    }
    return res.status(200).json({ data: { hotel } });
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err.message);
      return res.status(400).json({ message: "Invalid hotel ID" });
    }
    return next(new Error("An unknown error occurred"));
  }
}

export async function updateMyHotelHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const hotelToUpdate: HotelType = req.body;
    hotelToUpdate.lastUpdate = new Date();

    const hotel = await HotelModel.findByIdAndUpdate(
      { _id: req.params.hotelId, user: res.locals.user },
      hotelToUpdate,
      { new: true }
    );
    if (!hotel) {
      return res.status(404).json({ message: "Hotel for update not found" });
    }
    const files = req.files as Express.Multer.File[];
    const updatedImageUrls = await uploadImages(files);

    if (updatedImageUrls) {
      const iteratorImageUrls = updatedImageUrls[Symbol.iterator]();
      hotel.imageUrls = [
        ...iteratorImageUrls,
        ...(hotelToUpdate.imageUrls || []),
      ];
    }
    await hotel.save();
    return res.status(200).json({ data: { hotel } });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      logger.error(err.message);
      return res
        .status(400)
        .json({ message: "Hotel for update has invalid ID" });
    }
    return next(new Error("An unknown error occurred"));
  }
}
