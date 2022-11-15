import { Bot } from "grammy";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";

import { groupRegex, mondayTimes, times } from "./constants";
import { groups } from "./models";
import { ChatDocument, chats } from "./models/chat.model";
import { GroupDocument } from "./models/group.model";
import { MyContext } from "./types/context.type";
import { LessonTime } from "./types/lesson.type";
import Schedule from "./types/schedule.type";

/**
 * Преобразует строку в LessnTime
 * @param {string} time строка в формате HH:mm-HH:mm
 * @return {LessonTime}
 */
export function convertToLessonTime(time: string) {
  const [start, end] = time.split("-").map((time) => {
    const [hours, minutes] = time.split(":").map((v) => +v);

    return dayjs().hour(hours).minute(minutes);
  });

  return { start, end };
}

/**
 * Преобразует номер пары в время пары
 * @param {string} num номер пары
 * @param {boolean} isMonday использоваться ли расписание для понедельника
 * @return {string} время пары
 */
export function numToTime(num: string, isMonday = false): LessonTime {
  const selectedTime = isMonday ? mondayTimes[num] : times[num];

  const lessonTime = convertToLessonTime(selectedTime);

  return lessonTime;
}

/**
 * Создает ссылку до расписания
 * @param {number} groupId group id
 * @param {Dayjs} date date
 * @return {string} schedule url
 */
function getScheduleUrl(groupId: number, date: Dayjs = dayjs()): string {
  return [
    "https://asu.samgk.ru/api/schedule",
    groupId,
    date.format("YYYY-MM-DD"),
  ].join("/");
}

/**
 * Получает расписание
 * @param {GroupDocument} group группа
 * @param {Dayjs} date дата
 * @return {Schedule} расписание
 */
export async function fetchSchedule(
  group: GroupDocument,
  date: Dayjs = dayjs()
): Promise<Schedule> {
  const { data } = await axios.get<Schedule>(getScheduleUrl(group.id, date));

  return data;
}

/**
 * Получает расписание для списка групп
 * @param {number[]} groupIds
 * @param {Dayjs} date
 * @return {Schedule[]}
 */
export async function fetchManyGroups(
  groupIds: number[],
  date: Dayjs = dayjs()
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
 * Возвращает следующий будний день
 * @param {Dayjs} date дата от которой искать
 * @return {Dayjs} следующий будний день
 */
export function getNextWorkDate(date: Dayjs): Dayjs {
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

/**
 * Отменяет подписку на расписание
 * @param {ChatDocument} chat объект чата
 * @return {boolean} получилось ли отписаться
 */
export async function removeSubscription(chat: ChatDocument) {
  if (chat?.subscription?.groupId) {
    chat.subscription = {
      groupId: undefined,
      lastSchedule: {} as Schedule,
    };
    await chat.save();
    return true;
  }
  return false;
}

/**
 * Находит учебную группу в тексте и возвращает ее
 * @param {string} text текст
 * @return {GroupDocument | null} учебная группа
 */
export async function getGroupFromString(
  text: string
): Promise<GroupDocument | null> {
  const regexResult = groupRegex.exec(text);

  if (regexResult?.length) {
    const groupName = regexResult.slice(1).join("-").toUpperCase();
    const group = await groups.findOne({ name: groupName });
    return group;
  }

  return null;
}

/**
 * Получение сообщения для отправки пользователю
 * @param {Schedule} schedule объект расписания
 * @param {GroupDocument} group группа для которой расписание
 * @return {string} сообщение для пользователя
 */
export function getScheduleMessage(
  schedule: Schedule,
  group: GroupDocument
): string {
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

/**
 * Сравнивает два расписания
 * @param {Schedule} a первое расписание
 * @param {Schedule} b второе расписание
 * @return {boolean} результат сравнения
 */
export function compareSchedule(a: Schedule, b: Schedule) {
  if (a.date !== b.date) return false;

  if (a.lessons.length !== b.lessons.length) return false;

  for (let i = 0; i < a.lessons.length; i++) {
    const lessonA = a.lessons[i];
    const lessonB = b.lessons[i];

    if (lessonA.num !== lessonB.num) return false;
    if (lessonA.title !== lessonB.title) return false;
    if (lessonA.teachername !== lessonB.teachername) return false;
    if (lessonA.cab !== lessonB.cab) return false;
  }

  return true;
}

/**
 * Вызывает console.log с добавлением времени в начало сообщения
 * @param {string} message сообщение
 */
export function log(message: string) {
  const time = `[${dayjs().format("HH:mm:ss")}]`;
  console.log([time, message].join(" "));
}

/**
 * Проверяет обновления расписания
 * @param {Bot<T extends MyContext>} bot Telegram bot
 */
export async function update<T extends MyContext>(bot: Bot<T>) {
  log("start checking schedule");
  const chatsWithSubscription = await chats.where("subscription.groupId").gt(0);
  log("chats have been loaded");
  const subscribedGroups = await groups.find({
    id: {
      $in: chatsWithSubscription.map(
        (chat: ChatDocument) => chat.subscription.groupId
      ),
    },
  });
  log("groups have been loaded");

  log("fetching schedules...");
  const nextDate: Dayjs = getNextWorkDate(dayjs().add(1, "day"));
  const schedules: Map<number, Schedule> = await fetchManyGroups(
    subscribedGroups.map((group: GroupDocument) => group.id),
    nextDate
  );

  log("compare schedules...");
  for (const chat of chatsWithSubscription) {
    const group = subscribedGroups.find(
      (group) => group.id === chat.subscription.groupId
    );
    if (!group || !chat.subscription.groupId) continue;

    const newSchedule = schedules.get(chat.subscription.groupId);
    if (!newSchedule) continue;

    const lastSchedule = chat.subscription.lastSchedule;

    const isEquals = compareSchedule(lastSchedule, newSchedule);
    const isScheduleNew = isEquals === false && newSchedule.lessons.length;

    try {
      if (isScheduleNew) {
        log(group.name + " расписание изменилось");

        chat.subscription.lastSchedule = newSchedule;
        await chat.save();

        const message = getScheduleMessage(newSchedule, group);

        await bot.api.sendMessage(chat.id, "Вышло новое расписание!");
        await bot.api.sendMessage(chat.id, message);
      } else {
        log(group.name + " расписание не изменилось");
      }
    } catch (error) {
      log("ошибка при отправки сообщения в " + chat.id);
    }
  }
  log("done");
}
