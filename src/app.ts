import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";

import bot from "./bot";
import logger from "./utils/logger";
import { subscriptionService } from "./utils/subscription.service";
import { connection, databaseName, scheduleCollection } from "./db";

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

  scheduleCollection
    .updateMany({}, { $set: { "schedule.date": "" } })
    .then((result) => {
      console.log(result);
      subscriptionService.checkSchedule(bot);
    });

  subscriptionService.setCheckingBySchedule("*/15 * * * *", bot);
}

start();
