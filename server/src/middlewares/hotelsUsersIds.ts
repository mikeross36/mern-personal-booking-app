import { Request, Response, NextFunction } from "express";

export function setHotelAndUserIds(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.body.hotel) req.body.hotel = req.params.hotelId;
  if (!req.body.user) req.body.user = res.locals.user;
  next();
}
