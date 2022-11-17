import { I18n } from "@grammyjs/i18n";
import { MongoDBAdapter } from "@grammyjs/storage-mongodb";
import { Bot, session } from "grammy";
import path from "path";

import logComposer from "./composers/log.composer";
import miscComposer from "./composers/misc.composer";
import scheduleComposer from "./composers/schedule.composer";
import startComposer from "./composers/start.composer";
import subscribeComposer from "./composers/subscribe.composer";
import triggerComposer from "./composers/trigger.composer";
import { botCommands, isProduction } from "./constants";
import { chatsCollection } from "./db";
import { MyContext } from "./models/context.interface";

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

bot.use(
  session({
    initial: () => ({
      defaultGroup: 0,
      subscription: {
        groupId: 0,
        lastSchedule: undefined,
      },
      triggers: [],
    }),
    storage: new MongoDBAdapter({ collection: chatsCollection }),
  })
);

bot.use(logComposer);

bot.use(startComposer);

bot.use(scheduleComposer);
bot.use(subscribeComposer);
bot.use(triggerComposer);
bot.use(miscComposer);

export default bot;
