import axios, { AxiosResponse } from "axios";
import dayjs, { Dayjs } from "dayjs";

import { groupRegex, groupsApi, mondayTimes, times } from "./constants";
import { Schedule, MyContext, Group, LessonTime } from "./models";

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
 * @param {number} groupId id группы
 * @param {Dayjs} date дата
 * @return {Schedule} расписание
 */
export async function fetchSchedule(
  groupId: number,
  date: Dayjs = dayjs()
): Promise<Schedule> {
  const { data } = await axios.get<Schedule>(getScheduleUrl(groupId, date));

  return data;
}

/**
 * Получает расписание для списка групп
 * @param {number[]} groupIds
 * @param {Dayjs} date
 * @return {Schedule[]}
 */
export async function fetchManySchedules(
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
export async function removeSubscription(ctx: MyContext) {
  if (ctx.session.subscription.groupId) {
    ctx.session.subscription = {
      groupId: 0,
      lastSchedule: undefined,
    };
    return true;
  }

  return false;
}

/**
 * Находит учебную группу в тексте и возвращает ее
 * @param {string} text текст
 * @return {Group | null} учебная группа
 */
export async function getGroupFromString(text: string) {
  const regexResult = groupRegex.exec(text);

  if (regexResult) {
    const groupName = regexResult.slice(1).join("-").toUpperCase();
    const group = await getGroupByName(groupName);

    return group;
  }

  return undefined;
}

/**
 * Получение сообщения для отправки пользователю
 * @param {Schedule} schedule объект расписания
 * @param {Group} group группа для которой расписание
 * @return {string} сообщение для пользователя
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
 * Получить все группы
 * @return массив всех групп
 */
export async function getAllGroups(): Promise<Group[]> {
  const response: AxiosResponse<Group[]> = await axios.get<Group[]>(groupsApi);
  const groups: Group[] = response.data;

  return groups;
}

/**
 * Получить группу по id
 * @param {number} id id группы
 * @return группа
 */
export async function getGroupById(id: number) {
  const groups = await getAllGroups();
  return groups.find((group: Group) => group.id === id);
}

/**
 * Получить группу по имени
 * @param {string} name имя группы
 * @return группа
 */
export async function getGroupByName(name: string) {
  const groups = await getAllGroups();
  return groups.find((group: Group) => group.name === name);
}

/**
 * Отправляет расписание на указанные день
 * @param {Context<MyContext>} ctx Context
 * @param {dayj.Dayjs} date  Date
 */
export async function sendShortSchedule(ctx: MyContext, date: dayjs.Dayjs) {
  const group = await getGroupById(ctx.session.defaultGroup);

  if (!group) {
    await ctx.reply(ctx.t("group_not_found"));
    return;
  }

  const schedule = await fetchSchedule(group.id, date);

  await ctx.reply(getScheduleMessage(schedule, group));
}

/**
 * Отправляет расписание на два дня
 * @param {Context} ctx контекст
 * @param {Dayjs} date дата (по умолчанию сегодня)
 */
export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const group = await getGroupById(ctx.session.defaultGroup);

  if (!group) {
    ctx.reply(ctx.t("group_not_found"));
    return;
  }

  const firstDate = getNextWorkDate(date);
  const secondDate = getNextWorkDate(firstDate.add(1, "day"));

  const firstSchedule = await fetchSchedule(group.id, firstDate);
  const secondSchedule = await fetchSchedule(group.id, secondDate);

  await ctx.reply(getScheduleMessage(firstSchedule, group));
  await ctx.reply(getScheduleMessage(secondSchedule, group));
}

/**
 * Вызывает console.log с добавлением времени в начало сообщения
 * @param {unknown} message сообщение
 * @param {string} timeFormat формат времени. Передается в dayjs.format
 */
export function log(message: unknown, timeFormat = "HH:mm:ss") {
  const time = `[${dayjs().format(timeFormat)}]`;

  const log: string =
    typeof message === "string"
      ? message
      : JSON.stringify(message, undefined, 2);

  console.log([time, log].join(log.includes("\n") ? "\n" : " "));
}

// /**
//  * Проверяет обновления расписания
//  * @param {Bot<MyContext>} bot Telegram bot
//  */
// export async function update(bot: Bot<MyContext>) {
// const filter = {
//   value: { defaultGroup: { $gt: 0 } },
// };
// const chatsWithSubscription = await chatsCollection.find().toArray();
// console.log(chatsWithSubscription);
// for (const doc of chatsWithSubscription) {
//   log(doc.value);
// }
// log("start checking schedule");
// log("chats have been loaded");
// const groups = await getAllGroups();
// log("groups have been loaded");
// log("fetching schedules...");
// const nextDate: Dayjs = getNextWorkDate(dayjs().add(1, "day"));
// const schedules: Map<number, Schedule> = await fetchManySchedules(
//   Array.from(groups).map((group: Group) => group.id),
//   nextDate
// );
// log("compare schedules...");
// chatsWithSubscription
//   .forEach(async (chat) => {
//     const group = subscribedGroups.find(
//       (group) => group.id === chat.subscription.groupId
//     );
//     if (!group || !chat.subscription.groupId) continue;
//     const newSchedule = schedules.get(chat.subscription.groupId);
//     if (!newSchedule) continue;
//     const lastSchedule = chat.subscription.lastSchedule;
//     const isEquals = compareSchedule(lastSchedule, newSchedule);
//     const isScheduleNew = isEquals === false && newSchedule.lessons.length;
//     try {
//       if (isScheduleNew) {
//         log(group.name + " расписание изменилось");
//         chat.subscription.lastSchedule = newSchedule;
//         await chat.save();
//         const message = getScheduleMessage(newSchedule, group);
//         await bot.api.sendMessage(chat.id, "Вышло новое расписание!");
//         await bot.api.sendMessage(chat.id, message);
//       } else {
//         log(group.name + " расписание не изменилось");
//       }
//     } catch (error) {
//       log("ошибка при отправки сообщения в " + chat.id);
//     }
//   })
//   .then(() => log("done"));
// }
