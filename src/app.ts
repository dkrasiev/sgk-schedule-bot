import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";

import { log, update } from "./utils";
import { MyContext } from "./types/context.type";
import bot from "./bot";

/**
 * start app
 */
async function start() {
  bot.start();
  log("Bot has been started");

  cron.schedule("*/15 * * * *", () => {
    update<MyContext>(bot);
  });
}

start();
