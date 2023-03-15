import { run } from "@grammyjs/runner";

import bot from "./bot";
import { mongoClient } from "./database";
import logger from "./utils/logger";
import { DB_NAME } from "./config";
import { finder } from "./services/finder.service";

logger.info("starting...");

Promise.all([mongoClient.connect(), bot.init(), finder.init()])
  .then(async () => {
    logger.info(`database name: ${DB_NAME}`);
    logger.info(`bot username: @${bot.botInfo.username}`);

    run(bot);
  })
  .catch(console.error);
