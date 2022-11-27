import path from "path";
import { Bot, GrammyError, HttpError, session } from "grammy";
import { I18n } from "@grammyjs/i18n";
import { sequentialize } from "@grammyjs/runner";
import { MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { AxiosError } from "axios";

import logComposer from "./composers/log.composer";
import miscComposer from "./composers/misc.composer";
import scheduleComposer from "./composers/schedule.composer";
import startComposer from "./composers/start.composer";
import subscribeComposer from "./composers/subscribe.composer";
import triggerComposer from "./composers/trigger.composer";
import logger from "./helpers/logger";
import { chatsCollection } from "./db";
import { MyContext } from "./interfaces/context.interface";
import { config } from "./config";

const botCommands = [
  { command: "help", description: "Помощь" },
  { command: "schedule", description: "Расписание на два дня" },
  { command: "today", description: "Расписание на сегодня" },
  { command: "tomorrow", description: "Расписание на завтра" },
  {
    command: "setdefault",
    description: "Выбрать группу/преподавателя по умолчанию",
  },
  {
    command: "removedefault",
    description: "Удалить группу/преподавателя по умолчанию",
  },
  { command: "subscribe", description: "Подписаться на обновления расписания" },
  {
    command: "unsubscribe",
    description: "Отписаться от обновлений расписания",
  },
  { command: "groups", description: "Показать все группы" },
  { command: "trigger", description: "Добавить или удалить триггер" },
];

const token = config.isProduction
  ? process.env.BOT_TOKEN
  : process.env.BOT_TOKEN_TEST;

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

bot.use(
  sequentialize((ctx) => {
    const chat = ctx.chat?.id.toString();
    const user = ctx.from?.id.toString();

    const chatIdentifier = [chat, user].join("");
    return chatIdentifier;
  })
);

bot.use(
  session({
    initial: () => ({
      defaultGroup: 0,
      subscribedGroup: 0,
      triggers: [],
    }),
    storage: new MongoDBAdapter({ collection: chatsCollection }),
  })
);

bot.use(logComposer);

bot.use(miscComposer);

bot.use(startComposer);

bot.use(subscribeComposer);
bot.use(triggerComposer);
bot.use(scheduleComposer);

bot.catch((error) => {
  const ctx = error.ctx;
  logger.error(`Error while handling update ${ctx.update.update_id}`, error);
  const e = error.error;
  if (e instanceof GrammyError) {
    logger.error("Error in request", e.description);
  } else if (e instanceof AxiosError) {
    logger.error("Axios error", e);

    if (e.response?.status.toString().startsWith("5")) {
      ctx.reply("Сервис недоступен");
    }
  } else if (e instanceof HttpError) {
    logger.error("Could not contact Telegram", e);
  } else {
    logger.error("Unknown error", e);
  }
});

export default bot;
