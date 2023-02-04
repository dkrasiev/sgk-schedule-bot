import { run } from "@grammyjs/runner";

import bot from "./bot";
import logger from "./helpers/logger";
import { mongoClient } from "./database";
import { config } from "./config";

logger.info("starting...");

Promise.all([mongoClient.connect(), bot.init()])
  .then(async () => {
    logger.info(`Database name: ${config.database.name}`);
    logger.info(`Bot username: @${bot.botInfo.username}`);

    run(bot);
  })
  .catch(console.error);
