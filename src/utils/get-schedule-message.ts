import dayjs from "dayjs";
import { Schedule } from "../models/schedule.interface";
import { mondayTimes, times } from "./times";

/**
 * Get schedule message for user
 * @param {Schedule | null} schedule Schedule
 * @param {string} title Title
 * @returns {string} Message for user
 */
export function getScheduleMessage(
  schedule?: Schedule,
  title?: string
): string {
  if (!schedule) return "Не удалось получить расписание";

  let message = [title, schedule.date].filter(Boolean).join("\n") + "\n\n";

  if (schedule.lessons.length === 0) {
    return message + "Расписания нет";
  }

  for (const lesson of schedule.lessons) {
    const [day, month, year] = schedule.date.split(".");
    const isMonday = dayjs([year, month, day].join("-")).day() === 1;

    const time = [lesson.num, (isMonday ? mondayTimes : times)[lesson.num]]
      .filter(Boolean)
      .join(" ");

    message +=
      [time, lesson.title, lesson.teachername, lesson.nameGroup, lesson.cab]
        .filter(Boolean)
        .join("\n") + "\n\n";
  }

  return message;
}
