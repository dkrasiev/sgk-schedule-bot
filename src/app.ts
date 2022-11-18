import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";

import { checkSchedule, log } from "./utils";
import bot from "./bot";

/**
 * start the app
 */
async function start() {
  bot.start().catch((e) => {
    console.error(e.message);
    return true;
  });
  log("Bot has been started");

  cron.schedule("*/15 * * * *", () => {
    checkSchedule(bot);
  });
}

start();
