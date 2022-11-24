import dayjs from "dayjs";

import { MyContext } from "../interfaces";
import { getScheduleMessage } from "./get-schedule-message";
import { groupApi } from "./group-api";
import { scheduleApi } from "./schedule-api";
import { getNextWeekday } from "./workdate";

/**
 * Remove subscription
 * @param {MyContext} ctx Bot context
 * @returns {boolean} Unsubscribe result
 */
export async function removeSubscription(ctx: MyContext) {
  if (ctx.session.chat.subscribedGroup) {
    ctx.session.chat.subscribedGroup = 0;
    return true;
  }

  return false;
}

/**
 * Send schedule for a day
 * @param {Context<MyContext>} ctx Bot context
 * @param {dayj.Dayjs} date Date
 * @returns {Promise<boolean>} Result
 */
export async function sendShortSchedule(
  ctx: MyContext,
  date = dayjs()
): Promise<boolean> {
  const group = await groupApi.getGroupFromContext(ctx);

  if (group === undefined) {
    await ctx.reply(ctx.t("group_not_found"));
    return false;
  }

  const schedule = await scheduleApi.getSchedule(group.id, date);

  await ctx.reply(getScheduleMessage(schedule, group));
  return true;
}

/**
 * Send schedule for two days
 * @param {Context} ctx Bot context
 * @param {Dayjs} date Date
 */
export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const firstDate = getNextWeekday(date);
  const secondDate = getNextWeekday(firstDate.add(1, "day"));

  const sendScheduleResult = await sendShortSchedule(ctx, firstDate);

  if (sendScheduleResult === true) {
    await sendShortSchedule(ctx, secondDate);
  }
}
