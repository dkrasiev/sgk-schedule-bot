import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";

import bot from "./bot";
import logger from "./helpers/logger";
import { scheduleCheckerService } from "./services/schedule-checker.service";
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
    bot.init().then(() => logger.info(`@${bot.botInfo.username} is running`));
  });

  scheduleCheckerService.setCheckingBySchedule("*/15 * * * *", bot);
}

start();
