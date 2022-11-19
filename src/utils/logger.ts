import dayjs from "dayjs";
import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp, start, ...meta }) => {
      const time = `[${dayjs(timestamp).format("HH:mm:ss.SSS")}]`;
      const output = [time, level];

      if (start) {
        const diff = dayjs(dayjs(start).diff());
        const executionTime = diff.format("mm:ss.SSS");

        output.push(executionTime);
      }

      output.push(message);

      const url = meta.config?.url;
      if (url) {
        output.push(url);
      }

      return output.filter(Boolean).join(" ");
    })
  ),
});

export default logger;
