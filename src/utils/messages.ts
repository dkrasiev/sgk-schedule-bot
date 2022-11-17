import dayjs from "dayjs";
import { Group, Schedule } from "../models";
import { numToTime } from "./schedule";

/**
 * Get schedule message for user
 * @param {Schedule} schedule Schedule
 * @param {Group} group Group
 * @return {string} Message for user
 */
export function getScheduleMessage(schedule: Schedule, group: Group): string {
  if (!schedule) return "Ошибка: не удалось получить расписание";

  const header = `${group?.name + "\n" || ""}${schedule.date}\n\n`;
  let message = header;

  const [day, month, year] = schedule.date
    .split(".")
    .map((v) => Number.parseInt(v));

  const isMonday =
    dayjs()
      .year(year)
      .month(month - 1)
      .date(day)
      .day() === 1;

  if (schedule.lessons.length > 0) {
    for (const lesson of schedule.lessons) {
      const { start, end } =
        typeof lesson.num === "string"
          ? numToTime(lesson.num, isMonday)
          : lesson.num;

      const time = `${start.format("HH:mm")}-${end.format("HH:mm")}`;

      message += lesson.num + " " + time + "\n";
      message += lesson.title + "\n";
      message += lesson.teachername + "\n";
      message += lesson.cab + "\n\n";
    }
  } else {
    message += "Расписания нет";
  }

  return message;
}