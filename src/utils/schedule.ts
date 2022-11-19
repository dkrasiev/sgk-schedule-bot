import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { mondayTimes, times } from "../constants";
import { LessonTime, MyContext, Schedule } from "../interfaces";
import { getGroupById } from "./groups";
import logger from "./logger";
import { getScheduleMessage } from "./messages";
import { getNextWeekday } from "./workdate";

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
  const group = await getGroupFromContext(ctx);

  if (group === undefined) {
    await ctx.reply(ctx.t("group_not_found"));
    return false;
  }

  const schedule = await getSchedule(group.id, date);

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

/**
 * Get group id from bot context
 * @param {MyContext} ctx Bot context
 * @returns {number | undefined} Group id or undefiend
 */
export function getGroupIdFromContext(ctx: MyContext) {
  return ctx.session.message.groupId || ctx.session.chat.defaultGroup;
}

/**
 * Get group from bot context
 * @param {MyContext} ctx Bot context
 * @returns Group
 */
export async function getGroupFromContext(ctx: MyContext) {
  const groupId = getGroupIdFromContext(ctx);

  return await getGroupById(groupId);
}

/**
 * Fetch group schedule
 * @param {number} groupId Group id
 * @param {Dayjs} date Date
 * @returns {Schedule} Schedule
 */
export async function getSchedule(
  groupId: number,
  date = dayjs()
): Promise<Schedule | null> {
  const response = await axios
    .get<Schedule>(getScheduleUrl(groupId, date))
    .catch((e) => {
      logger.error(e);
    });

  if (response) {
    return response.data;
  }

  return null;
}

/**
 * Get schedule for many groups
 * @param {number[]} groupIds Group ids
 * @param {Dayjs} date Date
 * @returns {Schedule[]} Array of groups
 */
export async function getManySchedules(
  groupIds: number[],
  date = dayjs()
): Promise<Map<number, Schedule>> {
  groupIds = Array.from(new Set(groupIds));

  const promises = groupIds.map((groupId) =>
    axios.get<Schedule>(getScheduleUrl(groupId, date))
  );

  const schedules = new Map<number, Schedule>();
  const responses = await axios.all(promises).catch((e) => {
    logger.error(e);
  });
  const pattern = /schedule\/(.*)\//;

  if (!responses) return schedules;

  for (const response of responses) {
    if (!response.config || !response.config.url) continue;

    const match = response.config.url.match(pattern);
    if (match == null) continue;

    const groupId = Number(match[1]);
    schedules.set(groupId, response.data);
  }

  return schedules;
}

/**
 * Get schedule url
 * @param {number} groupId Group id
 * @param {Dayjs} date Date
 * @returns {string} URL
 */
export function getScheduleUrl(groupId: number, date: Dayjs = dayjs()): string {
  const dateString = date.format("YYYY-MM-DD");
  return `https://asu.samgk.ru/api/schedule/${groupId}/${dateString}`;
}

/**
 * Transform lesson's number to lesson's time
 * @param {string} num Lesson's number
 * @param {boolean} isMonday Use monday schedule
 * @returns {string} Lesson's time
 */
export function numToTime(num: string, isMonday = false): LessonTime {
  const selectedTime = isMonday ? mondayTimes[num] : times[num];

  const lessonTime = convertToLessonTime(selectedTime);

  return lessonTime;
}

/**
 * Transform string to lesson's time
 * @param {string} time String in format: HH:mm-HH:mm
 * @returns {LessonTime} Lesson's time
 */
export function convertToLessonTime(time: string) {
  const [start, end] = time.split("-").map((time) => {
    const [hours, minutes] = time.split(":").map((v) => +v);

    return dayjs().hour(hours).minute(minutes);
  });

  return { start, end };
}
