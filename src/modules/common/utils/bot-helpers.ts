import dayjs from "dayjs";

import { diContainerService } from "../../../config/container";
// import { finder } from "../../../services/singleton-services";
import { ScheduleEntity, ScheduleService } from "../../core";
import { DateService } from "../../core/services/date.service";
import { MyContext } from "../models/my-context.type";
import { getScheduleMessage } from "./get-schedule-message";

export async function sendShortSchedule(
  ctx: MyContext,
  date = dayjs(),
): Promise<boolean> {
  const scheduleService = diContainerService.container.get(ScheduleService);
  // const entity = finder.searchInContext(ctx)[0];
  const entity = ([] as ScheduleEntity[])[0];

  if (entity) {
    const schedule = await scheduleService.getSchedule(entity, date.toDate());
    await ctx.reply(getScheduleMessage(schedule, entity.name));

    return true;
  }

  await ctx.reply(ctx.t("schedule_object_not_found"));
  return false;
}

export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const dateService = diContainerService.container.get(DateService);

  const firstDate = dateService.getNextWeekday(date.toDate());
  const secondDate = dateService.getNextWeekday(
    dayjs(firstDate).add(1, "day").toDate(),
  );

  (await sendShortSchedule(ctx, dayjs(firstDate))) &&
    (await sendShortSchedule(ctx, dayjs(secondDate)));
}
