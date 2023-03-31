import { run } from "@grammyjs/runner";
import cron from "node-cron";

import bot from "./bot";
import { mongoClient } from "./database";
import logger from "./utils/logger";
import { DB_NAME } from "./config";
import { finder } from "./services/finder.service";
import { ScheduleCheckerService } from "./services/schedule-checker.service";

logger.info("starting...");

Promise.all([mongoClient.connect(), bot.init(), finder.init()])
  .then(async () => {
    logger.info(`database name: ${DB_NAME}`);
    logger.info(`bot username: @${bot.botInfo.username}`);

    if (process.env["START_SCHEDULE_CHECKER"]) {
      logger.info("run schedule checker");

      const checker = new ScheduleCheckerService();
      cron.schedule("*/30 * * * *", () => checker.checkSchedule(bot));
    } else {
      logger.info("run bot");

      run(bot);
    }
  })
  .catch(console.error);
