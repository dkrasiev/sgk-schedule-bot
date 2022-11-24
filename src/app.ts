import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";

import bot from "./bot";
import logger from "./utils/logger";
import { scheduleCheckerService } from "./utils/schedule-checker.service";
import { connection, databaseName } from "./db";

/**
 * start the app
 */
async function start() {
  logger.info("starting...");
  connection.connect().then(() => {
    logger.info("MongoDB connected");
    logger.info(`Database name: ${databaseName}`);

    run(bot);
    logger.info("Bot is running");
  });

  scheduleCheckerService.setCheckingBySchedule("*/15 * * * *", bot);
}

start();
