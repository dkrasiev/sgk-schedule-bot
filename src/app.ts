import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";
import cron from "node-cron";

import { checkSchedule, log } from "./utils";
import bot from "./bot";

/**
 * start the app
 */
async function start() {
  const runner = run(bot);

  if (runner.isRunning()) {
    log("Bot is running");
  }

  cron.schedule("*/15 * * * *", () => {
    checkSchedule(bot);
  });
}

start();
