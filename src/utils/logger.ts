import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import winston from "winston";

dayjs.extend(duration);

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: () => {
        return `[${dayjs().format("HH:mm:ss.SSS")}]`;
      },
    }),
    winston.format.printf(
      ({ level, message, timestamp, durationMs, ...meta }) => {
        const output = [timestamp, level];

        const url = meta.config?.url;
        if (url) {
          output.push(url);
        }

        output.push(message);

        if (durationMs) {
          const executionTime = dayjs.duration(durationMs).asSeconds();

          output.push(`duration=${executionTime}`);
        }

        return output.filter(Boolean).join(" ");
      }
    )
  ),
});

export default logger;
