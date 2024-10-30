require("dotenv").config();
import express from "express";
import { corsOptions } from "./utils/options";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { logger } from "./utils/logger";
import { connectDb } from "./connections/connectDb";
import path from "path";

import authRouter from "./routes/authRoutes";
import userRouter from "./routes/userRoutes";
import myHotelRouter from "./routes/myHotelRoutes";
import hotelRouter from "./routes/hotelRoutes";
import bookingRouter from "./routes/bookingRoutes";

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use(corsOptions);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../../client/dist")));

// const limiter = rateLimit({
//   windowMs: 60 * 60 * 1000,
//   max: 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   message: "Error 429. To many requests from this IP",
// });
// app.use("/api", limiter);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/my-hotels", myHotelRouter);
app.use("/api/v1/hotels", hotelRouter);
app.use("/api/v1/bookings", bookingRouter);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`Server is running on port http://localhost:${PORT}`);
  connectDb();
});
