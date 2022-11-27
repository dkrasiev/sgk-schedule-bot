import dayjs from "dayjs";

/**
 * Get next weekday
 * @param {Dayjs} date Weekday from this date
 * @returns {Dayjs} Next weekday
 */
export function getNextWeekday(date = dayjs()) {
  switch (date.day()) {
    case 0:
      date = date.add(1, "day");
      break;
    case 6:
      date = date.add(2, "day");
      break;
  }

  return date;
}
