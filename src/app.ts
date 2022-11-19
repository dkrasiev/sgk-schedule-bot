import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";
import cron from "node-cron";

import { checkSchedule } from "./utils";
import bot from "./bot";
import logger from "./utils/logger";

/**
 * start the app
 */
async function start() {
  const runner = run(bot);

  if (runner.isRunning()) {
    logger.info("Bot is running");
  }

  checkSchedule(bot);

  cron.schedule("*/15 * * * *", () => {
    checkSchedule(bot);
  });
}

start();
