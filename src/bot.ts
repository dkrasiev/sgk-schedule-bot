import { I18n } from "@grammyjs/i18n";
import { sequentialize } from "@grammyjs/runner";
import { MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { parseMode } from "@grammyjs/parse-mode";
import { autoRetry } from "@grammyjs/auto-retry";
import { AxiosError } from "axios";
import { Bot, session } from "grammy";
import path from "path";

import adminComposer from "./composers/admin.composer";
import logComposer from "./composers/log.composer";
import miscComposer from "./composers/misc.composer";
import scheduleComposer from "./composers/schedule.composer";
import startComposer from "./composers/start.composer";
import subscribeComposer from "./composers/subscribe.composer";
import triggerComposer from "./composers/trigger.composer";
import { config } from "./config";
import { sessions } from "./database";
import logger from "./helpers/logger";
import { MyContext } from "./models/my-context.type";

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
  { command: "teacher", description: "Поиск по преподавателям" },
  { command: "cabinet", description: "Поиск по кабинетам" },
  { command: "groups", description: "Показать все группы" },
  { command: "trigger", description: "Добавить или удалить триггер" },
];

const bot = new Bot<MyContext>(config.botToken || "");

const i18n = new I18n({
  defaultLocale: "ru",
  useSession: true,
  directory: path.resolve(__dirname, "locales"),
});

bot.api.setMyCommands(botCommands);

bot.api.config.use(parseMode('HTML'));
bot.api.config.use(autoRetry());

bot.use(i18n);
bot.use(sequentialize((ctx) => `${ctx.chat?.id}${ctx.from?.id}`));
bot.use(
  session({
    initial: () => ({
      defaultGroup: 0,
      subscribedGroup: 0,
      triggers: [],
    }),
    storage: new MongoDBAdapter({ collection: sessions }),
  })
);

bot.use(logComposer);

bot.use(miscComposer);
bot.use(adminComposer);

bot.use(startComposer);

bot.use(subscribeComposer);
bot.use(triggerComposer);
bot.use(scheduleComposer);

bot.catch(({ ctx, error }) => {
  logger.error(`Error while handling update ${ctx.update.update_id}`, error);

  if (error instanceof AxiosError) {
    const status = error.response?.status || 200;

    if (status >= 500) ctx.reply("Расписание недоступно");
  }
});

export default bot;
