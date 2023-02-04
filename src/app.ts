import { run } from "@grammyjs/runner";
import cron from "node-cron";

import bot from "./bot";
import { config } from "./config";
import { mongoClient } from "./database";
import logger from "./helpers/logger";
import { scheduleCheckerService } from "./services/schedule-checker.service";

logger.info("starting...");

Promise.all([mongoClient.connect(), bot.init()])
  .then(async () => {
    logger.info(`database name: ${config.database.name}`);
    logger.info(`bot username: @${bot.botInfo.username}`);

    if (config.isScheduleChecker) {
      scheduleCheckerService.checkSchedule(bot);

      cron.schedule("*/60 * * * *", () =>
        scheduleCheckerService.checkSchedule(bot)
      );
    } else {
      run(bot);
    }
  })
  .catch(console.error);
