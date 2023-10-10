import winston from 'winston'

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'log.txt' }),
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({
      format: () =>
        new Intl.DateTimeFormat('ru-ru', {
          dateStyle: 'short',
          timeStyle: 'long',
        }).format(new Date()),
    }),
    winston.format.printf(({ level, message, timestamp, durationMs, config }) =>
      [
        `[${timestamp}]`,
        level,
        config?.url,
        message,
        (durationMs && `duration=${durationMs / 1000}s`) || undefined,
      ]
        .filter(Boolean)
        .join(' '),
    ),
  ),
})

export default logger
