import dayjs from "dayjs";

import { MyContext } from "../models/my-context.type";
import { getScheduleMessage } from "./get-schedule-message";
import { getNextWeekday } from "./get-next-weekday";
import { finder } from "../services/finder.service";

export async function sendShortSchedule(
  ctx: MyContext,
  date = dayjs()
): Promise<boolean> {
  const result = finder.searchFromContext(ctx);

  if (result.length > 0) {
    const entity = result[0];

    const schedule = await entity.getSchedule(date);
    await ctx.reply(getScheduleMessage(schedule, entity.name));

    return true;
  }

  await ctx.reply(ctx.t("schedule_object_not_found"));
  return false;
}

export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const firstDate = getNextWeekday(date);
  const secondDate = getNextWeekday(firstDate.add(1, "day"));

  (await sendShortSchedule(ctx, firstDate)) &&
    (await sendShortSchedule(ctx, secondDate));
}
