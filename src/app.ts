import dotenv from "dotenv";
dotenv.config();

import axios from "axios";
import { run } from "@grammyjs/runner";

import bot from "./bot";
import logger from "./helpers/logger";
import { scheduleCheckerService } from "./services/schedule-checker.service";
import { connection } from "./database";
import { config } from "./config";

axios.interceptors.request.use((request) => {
  request.headers = {
    ...request.headers,
    origin: "http://samgk.ru",
    referer: "http://samgk.ru/",
  };

  return request;
});

logger.info("starting...");

Promise.all([connection.connect(), bot.init()])
  .then(async () => {
    logger.info(`Database name: ${config.database.name}`);
    logger.info(`Bot username: @${bot.botInfo.username}`);

    run(bot);

    scheduleCheckerService.setCheckingBySchedule("*/30 * * * *", bot);
    // scheduleCheckerService.checkSchedule(bot);
  })
  .catch((e) => console.error(e));
