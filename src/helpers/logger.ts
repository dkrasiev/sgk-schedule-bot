import winston from "winston";

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp({
      format: () => `${new Date().toLocaleString()}`,
    }),
    winston.format.printf(({ level, message, timestamp, durationMs, config }) =>
      [
        `[${timestamp}]`,
        level,
        config?.url,
        message,
        (durationMs && `duration=${durationMs / 1000}s`) || null,
      ]
        .filter(Boolean)
        .join(" ")
    )
  ),
});

export default logger;
