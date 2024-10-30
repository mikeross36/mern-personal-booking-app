import pino from "pino";
import prettyPrint from "pino-pretty";

const levels = {
  http: 10,
  debug: 20,
  info: 30,
  warch: 40,
  error: 50,
};

export const logger = pino(
  { customLevels: levels, base: { pid: false } },
  prettyPrint({ colorize: true })
);
