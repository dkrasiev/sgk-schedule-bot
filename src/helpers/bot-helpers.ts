import dayjs from "dayjs";

import { MyContext } from "../interfaces";
import { getScheduleMessage } from "./get-schedule-message";
import { getNextWeekday } from "./weekday";
import { teacherService } from "../services/teacher.service";
import { groupService } from "../services/group.service";

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
  const argument = ctx.message?.text ?? "";

  if (argument) {
    const group = await groupService.findInText(argument);
    if (group) {
      const schedule = await groupService.getSchedule(group.id, date);
      await ctx.reply(getScheduleMessage(schedule, group.name));

      return true;
    }

    const teacher = await teacherService.findInText(argument);
    if (teacher) {
      const schedule = await teacherService.getSchedule(teacher.id, date);
      await ctx.reply(getScheduleMessage(schedule, teacher.name));

      return true;
    }
  }

  const id = ctx.session.defaultGroup;
  if (id) {
    const group = await groupService.findById(id);
    if (group) {
      const schedule = await groupService.getSchedule(group.id, date);
      await ctx.reply(getScheduleMessage(schedule, group.name));

      return true;
    }

    const teacher = await teacherService.findById(id.toString());
    if (teacher) {
      const schedule = await teacherService.getSchedule(teacher.id, date);
      await ctx.reply(getScheduleMessage(schedule, teacher.name));

      return true;
    }
  }

  await ctx.reply(ctx.t("group_not_found"));
  return false;
}

/**
 * Send schedule for two days
 * @param {Context} ctx Bot context
 * @param {Dayjs} date Date
 */
export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const firstDate = getNextWeekday(date);
  const secondDate = getNextWeekday(firstDate.add(1, "day"));

  (await sendShortSchedule(ctx, firstDate)) &&
    (await sendShortSchedule(ctx, secondDate));
}
