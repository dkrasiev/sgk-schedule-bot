import dayjs from "dayjs";

import { MyContext } from "../models/my-context.type";
import { getScheduleMessage } from "./get-schedule-message";
import { getNextWeekday } from "./weekday";
import { teacherService } from "../services/teacher.service";
import { groupService } from "../services/group.service";
import { scheduleService } from "../services/schedule.service";
import { cabinetsService } from "../services/cabinet.service";

export async function sendShortSchedule(
  ctx: MyContext,
  date = dayjs()
): Promise<boolean> {
  const argument = ctx.message?.text || "";

  if (argument) {
    const group = await groupService.findInText(argument);
    if (group) {
      const schedule = await scheduleService.group(group.id, date);
      await ctx.reply(getScheduleMessage(schedule, group.name));

      return true;
    }

    const teacher = await teacherService.findInText(argument);
    if (teacher) {
      const schedule = await scheduleService.teacher(teacher.id, date);
      await ctx.reply(getScheduleMessage(schedule, teacher.name));

      return true;
    }

    const cabinet = await cabinetsService.findInText(argument);
    if (cabinet) {
      const schedule = await scheduleService.cabinet(cabinet.id, date);
      await ctx.reply(getScheduleMessage(schedule, cabinet.name));

      return true;
    }
  }

  const id = ctx.session.defaultGroup;
  if (id) {
    const group = await groupService.findById(id);
    if (group) {
      const schedule = await scheduleService.group(group.id, date);
      await ctx.reply(getScheduleMessage(schedule, group.name));

      return true;
    }

    const teacher = await teacherService.findById(id.toString());
    if (teacher) {
      const schedule = await scheduleService.teacher(teacher.id, date);
      await ctx.reply(getScheduleMessage(schedule, teacher.name));

      return true;
    }
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
