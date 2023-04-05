import { run } from "@grammyjs/runner";
import cron from "node-cron";

import bot from "./bot";
import { DB_NAME } from "./config";
import { finder } from "./services/finder.service";
import { LoadWatchService } from "./services/load-watch.service";
import { messageCounter } from "./services/message-counter.service";
import { ScheduleCheckerService } from "./services/schedule-checker.service";
import logger from "./utils/logger";

main().catch(logger.error);

async function main() {
  logger.info("starting...");

  await bot.init();
  await finder.init();

  logger.info(`database name: ${DB_NAME}`);
  logger.info(`bot username: @${bot.botInfo.username}`);

  if (process.env["START_SCHEDULE_CHECKER"]) {
    logger.info("run schedule checker");

    const checker = new ScheduleCheckerService();
    cron.schedule("*/30 * * * *", () => checker.checkSchedule(bot)); // every thirty minutes
  } else {
    logger.info("run bot");

    new LoadWatchService(messageCounter);

    run(bot);
  }
}
