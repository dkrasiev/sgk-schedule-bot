import { autoRetry } from "@grammyjs/auto-retry";
import { I18n } from "@grammyjs/i18n";
import { parseMode } from "@grammyjs/parse-mode";
import { sequentialize } from "@grammyjs/runner";
import { MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { AxiosError } from "axios";
import { Bot, session } from "grammy";
import path from "path";

import adminComposer from "./composers/admin.composer";
import commandNotFoundComposer from "./composers/command-not-found.composer";
import logComposer from "./composers/log.composer";
import miscComposer from "./composers/misc.composer";
import scheduleComposer from "./composers/schedule.composer";
import startComposer from "./composers/start.composer";
import subscribeComposer from "./composers/subscribe.composer";
import triggerComposer from "./composers/trigger.composer";
import { BOT_TOKEN } from "./config";
import { sessions } from "./database";
import { MyContext } from "./models/my-context.type";
import logger from "./utils/logger";
import { finder } from "./services/singleton-services";

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
  {
    command: "search",
    description: "Поиск по группам, преподавателям и кабинетам",
  },
  { command: "trigger", description: "Добавить или удалить триггер" },
];

const bot = new Bot<MyContext>(BOT_TOKEN || "");

bot.api.setMyCommands(botCommands);

bot.api.config.use(parseMode("HTML"));
bot.api.config.use(autoRetry());

bot.use(
  new I18n({
    defaultLocale: "ru",
    useSession: true,
    directory: path.resolve(__dirname, "locales"),
  }).middleware()
);
bot.use(
  sequentialize((ctx) => [ctx.from?.id, ctx.chat?.id].filter(Boolean).join())
);
bot.use(
  session({
    initial: () => ({
      default: undefined,
      subscription: undefined,
      triggers: [],
    }),
    storage: new MongoDBAdapter({ collection: sessions }),
  })
);
// custom config
bot.use(async (ctx, next) => {
  ctx.getDefault = () =>
    ctx.session.default ? finder.getById(ctx.session.default) : undefined;

  await next();
});

bot.use(logComposer);

bot.use(miscComposer);
bot.use(adminComposer);

bot.use(startComposer);

bot.use(subscribeComposer);
bot.use(triggerComposer);
bot.use(scheduleComposer);

bot.use(commandNotFoundComposer);

bot.catch(({ ctx, error }) => {
  logger.error(`Error while handling update ${ctx.update.update_id}`, error);

  if (error instanceof AxiosError) {
    const status = error.response?.status || 200;

    if (status >= 500) ctx.reply("Расписание недоступно");
  }
});

export default bot;
