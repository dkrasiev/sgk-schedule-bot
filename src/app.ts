import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";
import cron from "node-cron";

import { checkSchedule } from "./utils/bot-helpers";
import bot from "./bot";
import logger from "./utils/logger";
import { connection, databaseName } from "./db";

/**
 * start the app
 */
async function start() {
  logger.info("starting...");
  connection.connect().then(() => {
    logger.info("MongoDB connected");
    logger.info(`Database name: ${databaseName}`);
    const runner = run(bot);
    if (runner.isRunning()) logger.info("Bot is running");
  });

  cron.schedule("*/15 * * * *", () => {
    checkSchedule(bot);
  });
}

start();
