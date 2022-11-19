import dayjs from "dayjs";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      const time = dayjs(timestamp).format("HH:mm:ss.SSS");
      return `[${time}] ${level}: ${message}`;
    })
  ),
});

export default logger;
