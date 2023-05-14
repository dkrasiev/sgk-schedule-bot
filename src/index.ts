import { run } from "@grammyjs/runner";
import cron from "node-cron";

import bot from "./bot";
import { MONGODB_NAME } from "./config";
import { LoadWatchService } from "./services/load-watch.service";
import { ScheduleCheckerService } from "./services/schedule-checker.service";
import { counter, finder, sgkApi } from "./services/singleton-services";
import logger from "./utils/logger";

main().catch(logger.error);

async function main() {
  logger.info("starting...");

  await bot.init();
  await finder.init();

  logger.info(`database name: ${MONGODB_NAME}`);
  logger.info(`bot username: @${bot.botInfo.username}`);

  // if (SCHEDULE_CHECKER) {
  // schedule checker
  logger.info("run schedule checker");
  const checker = new ScheduleCheckerService(finder, sgkApi);
  cron.schedule("*/30 * * * *", () => checker.checkSchedule(bot)); // at every 30 minute
  // } else {
  // bot
  logger.info("run bot");
  new LoadWatchService(counter);
  run(bot);
  // }
}
