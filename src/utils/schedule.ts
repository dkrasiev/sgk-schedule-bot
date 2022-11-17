import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { mondayTimes, times } from "../constants";
import { LessonTime, MyContext, Schedule } from "../models";
import { getGroupById } from "./groups";
import { getScheduleMessage } from "./messages";
import { getNextWeekday } from "./workdate";

/**
 * Send schedule for a day
 * @param {Context<MyContext>} ctx Bot context
 * @param {dayj.Dayjs} date Date
 */
export async function sendShortSchedule(ctx: MyContext, date: dayjs.Dayjs) {
  const group = await getGroupById(ctx.session.defaultGroup);

  if (!group) {
    await ctx.reply(ctx.t("group_not_found"));
    return;
  }

  const schedule = await getSchedule(group.id, date);

  await ctx.reply(getScheduleMessage(schedule, group));
}

/**
 * Send schedule for two days
 * @param {Context} ctx Bot context
 * @param {Dayjs} date Date
 */
export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const group = await getGroupById(ctx.session.defaultGroup);

  if (!group) {
    ctx.reply(ctx.t("group_not_found"));
    return;
  }

  const firstDate = getNextWeekday(date);
  const secondDate = getNextWeekday(firstDate.add(1, "day"));

  const firstSchedule = await getSchedule(group.id, firstDate);
  const secondSchedule = await getSchedule(group.id, secondDate);

  await ctx.reply(getScheduleMessage(firstSchedule, group));
  await ctx.reply(getScheduleMessage(secondSchedule, group));
}

/**
 * Fetch group schedule
 * @param {number} groupId Group id
 * @param {Dayjs} date Date
 * @return {Schedule} Schedule
 */
export async function getSchedule(
  groupId: number,
  date: Dayjs = dayjs()
): Promise<Schedule> {
  const { data } = await axios.get<Schedule>(getScheduleUrl(groupId, date));

  return data;
}

/**
 * Get schedule for many groups
 * @param {number[]} groupIds Group ids
 * @param {Dayjs} date Date
 * @return {Schedule[]} Array of groups
 */
export async function fetchManySchedules(
  groupIds: number[],
  date = dayjs()
): Promise<Map<number, Schedule>> {
  const schedules = new Map<number, Schedule>();
  const responses = await axios.all(
    groupIds.map((groupId) =>
      axios.get<Schedule>(getScheduleUrl(groupId, date))
    )
  );
  const pattern = /schedule\/(.*)\//;

  for (const response of responses) {
    if (!response.config || !response.config.url) continue;

    const match = response.config.url.match(pattern);
    if (match == null) continue;

    const groupId = +match[1];
    schedules.set(groupId, response.data);
  }

  return schedules;
}

/**
 * Get schedule url
 * @param {number} groupId Group id
 * @param {Dayjs} date Date
 * @return {string} URL
 */
export function getScheduleUrl(groupId: number, date: Dayjs = dayjs()): string {
  return [
    "https://asu.samgk.ru/api/schedule",
    groupId,
    date.format("YYYY-MM-DD"),
  ].join("/");
}

/**
 * Transform lesson's number to lesson's time
 * @param {string} num Lesson's number
 * @param {boolean} isMonday Use monday schedule
 * @return {string} Lesson's time
 */
export function numToTime(num: string, isMonday = false): LessonTime {
  const selectedTime = isMonday ? mondayTimes[num] : times[num];

  const lessonTime = convertToLessonTime(selectedTime);

  return lessonTime;
}

/**
 * Transform string to lesson's time
 * @param {string} time String in format: HH:mm-HH:mm
 * @return {LessonTime} Lesson's time
 */
export function convertToLessonTime(time: string) {
  const [start, end] = time.split("-").map((time) => {
    const [hours, minutes] = time.split(":").map((v) => +v);

    return dayjs().hour(hours).minute(minutes);
  });

  return { start, end };
}
