import mongoose from "mongoose";
import { logger } from "../utils/logger";

const mongoDbUserName = process.env.MONGODB_USERNAME;
const mongoDbPassword = process.env.MONGODB_PASSWORD;
const mongoDbName = process.env.MONGODB_NAME;

const dbUrl = `mongodb+srv://${mongoDbUserName}:${mongoDbPassword}@clustermern.nmajtcj.mongodb.net/${mongoDbName}?retryWrites=true&w=majority`;

export async function connectDb() {
  try {
    await mongoose.connect(dbUrl);
    logger.info("Database connected...");
  } catch (err: any) {
    logger.error(err.message, "Database connection failed!");
    const timer = setTimeout(() => {
      connectDb();
      process.exit(1);
    }, 5000);
    return () => {
      clearTimeout(timer);
    };
  }
}
