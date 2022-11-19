import { Bot, GrammyError, HttpError, session } from "grammy";
import { I18n } from "@grammyjs/i18n";
import { sequentialize } from "@grammyjs/runner";
import { MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { AxiosError } from "axios";
import path from "path";

import groupComposer from "./composers/group.composer";
import logComposer from "./composers/log.composer";
import miscComposer from "./composers/misc.composer";
import scheduleComposer from "./composers/schedule.composer";
import startComposer from "./composers/start.composer";
import subscribeComposer from "./composers/subscribe.composer";
import triggerComposer from "./composers/trigger.composer";
import { botCommands, isProduction } from "./constants";
import { chatsCollection } from "./db";
import { MyContext } from "./interfaces/context.interface";
import logger from "./utils/logger";

const token = isProduction ? process.env.BOT_TOKEN : process.env.BOT_TOKEN_TEST;

if (!token) {
  throw new Error("Bot token is required");
}

const bot = new Bot<MyContext>(token);

const i18n = new I18n({
  defaultLocale: "ru",
  useSession: true,
  directory: path.resolve(__dirname, "locales"),
});

bot.api.setMyCommands(botCommands);

bot.use(i18n);

bot.use(sequentialize((ctx) => ctx.chat?.id.toString()));

bot.use(
  session({
    type: "multi",
    chat: {
      initial: () => ({
        defaultGroup: 0,
        subscribedGroup: 0,
        triggers: [],
      }),
      storage: new MongoDBAdapter({ collection: chatsCollection }),
    },
    message: {
      initial: () => ({}),
    },
  })
);

bot.use(logComposer);

bot.use(groupComposer);
bot.use(miscComposer);

bot.use(startComposer);

bot.use(subscribeComposer);
bot.use(triggerComposer);
bot.use(scheduleComposer);

bot.catch((error) => {
  const ctx = error.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}:`);
  const e = error.error;
  if (e instanceof GrammyError) {
    logger.error("Error in request:", e.description);
  } else if (e instanceof AxiosError) {
    logger.error("Axios error:", e.status || e.code, e.message);
    logger.error(e);
    if (
      e.config.url?.includes("samgk") &&
      (e.code === "ETIMEDOUT" || e.status?.startsWith("5"))
    ) {
      ctx.reply("Сервис временно недоступен");
    }
  } else if (e instanceof HttpError) {
    logger.error("Could not contact Telegram:", e);
  } else {
    logger.error("Unknown error:", e);
  }
});

export default bot;
