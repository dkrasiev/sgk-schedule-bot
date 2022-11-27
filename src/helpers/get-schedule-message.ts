import dayjs from "dayjs";
import { Schedule } from "../interfaces";
import { numToTime } from "./lessons-utils";

/**
 * Get schedule message for user
 * @param {Schedule | null} schedule Schedule
 * @param {string} title Title
 * @returns {string} Message for user
 */
export function getScheduleMessage(
  schedule: Schedule | null,
  title: string
): string {
  if (!schedule) return "Ошибка: не удалось получить расписание";

  const header = `${title + "\n" || ""}${schedule.date}\n\n`;
  let message = header;

  if (schedule.lessons.length > 0) {
    const [day, month, year] = schedule.date
      .split(".")
      .map((v) => Number.parseInt(v));

    const isMonday =
      dayjs()
        .year(year)
        .month(month - 1)
        .date(day)
        .day() === 1;

    for (const lesson of schedule.lessons) {
      const { start, end } =
        typeof lesson.num === "string"
          ? numToTime(lesson.num, isMonday)
          : lesson.num;

      const time = `${start.format("HH:mm")}-${end.format("HH:mm")}`;

      message += lesson.num + " " + time + "\n";
      message += lesson.title + "\n";

      if (lesson.teachername) {
        message += lesson.teachername + "\n";
      }

      if (lesson.nameGroup) {
        message += lesson.nameGroup + "\n";
      }

      message += lesson.cab + "\n\n";
    }
  } else {
    message += "Расписания нет";
  }

  return message;
}
