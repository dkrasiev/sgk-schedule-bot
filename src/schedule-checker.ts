import dotenv from "dotenv";
dotenv.config();

import cron from "node-cron";

import bot from "./bot";
import logger from "./helpers/logger";
import { scheduleCheckerService } from "./services/schedule-checker.service";
import { mongoClient } from "./database";
import { config } from "./config";

logger.info("starting...");

Promise.all([mongoClient.connect(), bot.init()])
  .then(async () => {
    logger.info(`Database name: ${config.database.name}`);
    logger.info(`Bot username: @${bot.botInfo.username}`);

    scheduleCheckerService.checkSchedule(bot);
    
    cron.schedule("*/60 * * * *", () =>
      scheduleCheckerService.checkSchedule(bot)
    );
  })
  .catch((e) => console.error(e));
