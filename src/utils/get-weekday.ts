import dayjs from "dayjs";

export function getWeekday(offsetInDays = 0, date = dayjs()) {
  date = date.add(offsetInDays, "day");

  if (date.day() === 0) {
    return date.add(1, "day");
  }

  if (date.day() === 6) {
    return date.add(2, "day");
  }

  return date;
}
