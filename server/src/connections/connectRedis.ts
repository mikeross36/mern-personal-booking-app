import { createClient, RedisClientType } from "redis";
import { logger } from "../utils/logger";

const redisUrl = process.env.REDIS_URL;
const redisClient: RedisClientType = createClient({ url: redisUrl });

let retryDelay = 1000;
const maxRetryDelay = 60000;

(function connectRedis() {
  (async function () {
    try {
      await redisClient.connect();
      logger.info("Redis client connected...");
    } catch (err) {
      if (err instanceof Error) {
        logger.error(err.message);
        retryDelay = Math.min(retryDelay * 2, maxRetryDelay);
        const timer = setTimeout(() => {
          connectRedis();
        }, retryDelay);
        return () => {
          clearTimeout(timer);
        };
      }
    }
  })();
})();

redisClient.on("error", (err) => logger.error(err.message));

export default redisClient;
