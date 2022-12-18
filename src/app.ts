import dotenv from "dotenv";
dotenv.config();

import { run } from "@grammyjs/runner";

import bot from "./bot";
import logger from "./helpers/logger";
import { scheduleCheckerService } from "./services/schedule-checker.service";
import { connection, databaseName } from "./db";
import axios from "axios";

/**
 * start the app
 */
async function start() {
  axios.interceptors.request.use((request) => {
    request.headers = {
      ...request.headers,
      origin: "http://samgk.ru",
      referer: "http://samgk.ru/",
    };

    return request;
  });

  logger.info("starting...");
  connection.connect().then(() => {
    logger.info("MongoDB connected");
    logger.info(`Database name: ${databaseName}`);

    run(bot);
    bot.init().then(() => logger.info(`@${bot.botInfo.username} is running`));
  });

  scheduleCheckerService.setCheckingBySchedule("*/60 * * * *", bot);
}

start();
