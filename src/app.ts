import { run } from "@grammyjs/runner";

import bot from "./bot";
import logger from "./helpers/logger";
import { connection } from "./database";
import { config } from "./config";

logger.info("starting...");

Promise.all([connection.connect(), bot.init()])
  .then(async () => {
    logger.info(`Database name: ${config.database.name}`);
    logger.info(`Bot username: @${bot.botInfo.username}`);

    run(bot);
  })
  .catch((e) => console.error(e));
