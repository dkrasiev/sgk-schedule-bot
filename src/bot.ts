import { Telegraf } from "telegraf";
import { i18n } from "./i18n";

import { MyContext } from "./types/context.type";
import { botCommands } from "./constants";
import startComposer from "./composers/start.composer";
import triggerComposer from "./composers/trigger.composer";
import logComposer from "./composers/log.composer";
import chatComposer from "./composers/chat.composer";
import groupComposer from "./composers/group.composer";
import mainComposer from "./composers/main.composer";
import subscribeComposer from "./composers/subscribe.composer";
import scheduleComposer from "./composers/schedule.composer";
import adminComposer from "./composers/admin.composer";

/**
 * Get telegram bot with specific token
 * @param {string} token bot token
 * @return {Telegraf<T>} telegram bot
 */
export function createBot<T extends MyContext>(token: string): Telegraf<T> {
  const bot = new Telegraf<T>(token);

  bot.telegram.setMyCommands(botCommands);

  bot.use(i18n.middleware());

  bot.use(logComposer);
  bot.use(chatComposer);
  bot.use(groupComposer);

  bot.use(adminComposer);

  bot.use(startComposer);
  bot.use(mainComposer);
  bot.use(subscribeComposer);
  bot.use(triggerComposer);

  bot.use(scheduleComposer);

  return bot;
}
