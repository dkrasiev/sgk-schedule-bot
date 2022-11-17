import dotenv from "dotenv";
dotenv.config();

// import cron from "node-cron";

import { log } from "./utils";
import bot from "./bot";

/**
 * start app
 */
async function start() {
  bot.start();
  log("Bot has been started");

  // update(bot);

  // cron.schedule("*/15 * * * *", () => {
  //   update(bot);
  // });
}

start();
