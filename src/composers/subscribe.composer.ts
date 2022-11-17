import { Composer } from "grammy";
import dayjs from "dayjs";
import {
  removeSubscription,
  getGroupById,
  getNextWeekday,
  getSchedule,
  getGroupFromContext,
} from "../utils";
import { MyContext } from "../models/context.interface";

const subscribeComposer = new Composer<MyContext>();

subscribeComposer.command("subscribe", async (ctx) => {
  if (!ctx.chat) return;

  const group = await getGroupFromContext(ctx);

  if (!group) {
    await ctx.reply(ctx.t("subscribe_fail"), { parse_mode: "HTML" });
    return;
  }

  const firstDate = getNextWeekday(dayjs());
  const secondDate = getNextWeekday(firstDate);

  const schedule = await getSchedule(group.id, secondDate);

  ctx.session.chat.subscription = {
    groupId: group.id,
    lastSchedule: schedule,
  };

  await ctx.reply(ctx.t("subscribe_success", { name: group.name }));
});

subscribeComposer.command("unsubscribe", async (ctx) => {
  const group = await getGroupById(ctx.session.chat.defaultGroup);
  if (!group) return;

  const removeSubscriptionResult = await removeSubscription(ctx);

  if (removeSubscriptionResult === false) {
    await ctx.reply(ctx.t("unsubscribe_fail"));
    return;
  }

  await ctx.reply(ctx.t("unsubscribe_success", { name: group.name }));
});

export default subscribeComposer;
