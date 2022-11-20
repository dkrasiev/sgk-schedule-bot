import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";
import cron from "node-cron";
import shjs from "shelljs";
import express from "express";

import { checkSchedule } from "./utils/bot-helpers";
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

  const app = express();
  const port = process.env.PORT ?? 3000;

  app.get("/pull", (req, res) => {
    shjs.exec("git pull");
    console.log(req);

    res.send("Hello World!");
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });

  cron.schedule("*/15 * * * *", () => {
    checkSchedule(bot);
  });
}

start();
