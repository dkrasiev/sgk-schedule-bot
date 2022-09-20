import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import {MyContext} from './types/context.type';
import {groups} from './models';
import {ChatDocument} from './models/chat.model';
import {GroupDocument} from './models/group.model';
import Schedule from './types/schedule.type';

const groupRegex = new RegExp(/([А-я]{1,3})[\W]?(\d{2})[\W]?(\d{2})/);

interface Times {
  [key: string | number]: string;
}

/**
 * Преобразует номер пары в время пары
 * @param {string | number} num номер пары
 * @return {string} время пары
 */
export function numToTime(num: string | number): string {
  const times: Times = {
    '1': '08:25-10:00',
    '2': '10:10-11:45',
    '3': '12:15-13:50',
    '4': '14:00-15:35',
    '5': '15:45-17:20',
    '6': '17:30-19:05',
    '7': '19:15-20:50',
    '1.1': '08:25-09:10',
    '1.2': '09:15-10:00',
    '2.1': '10:10-10:55',
    '2.2': '11:00-11:45',
    '3.1': '12:15-13:00',
    '3.2': '13:05-13:50',
    '4.1': '14:00-14:45',
    '4.2': '14:50-15:35',
    '5.1': '15:45-16:30',
    '5.2': '16:35-17:20',
    '6.1': '17:30-18:15',
    '6.2': '18:20-19:05',
    '7.1': '19:15-20:00',
    '7.2': '20:05-20:50',
  };
  return times[num];
}

/**
 * Получает расписание
 * @param {GroupDocument} group группа
 * @param {Dayjs} date дата
 * @return {Schedule} расписание
 */
export async function fetchSchedule(
    group: GroupDocument,
    date: Dayjs,
): Promise<Schedule> {
  const {data} = await axios.get<Schedule>(
      [
        'https://asu.samgk.ru/api/schedule',
        group.id,
        date.format('YYYY-MM-DD'),
      ].join('/'),
  );

  return data;
}

/**
 * Возвращает следующий будний день
 * @param {Dayjs} date дата от которой искать
 * @return {Dayjs} следующий будний день
 */
export function getNextWorkDate(date: Dayjs): Dayjs {
  switch (date.day()) {
    case 0:
      date = date.add(1, 'day');
      break;
    case 6:
      date = date.add(2, 'day');
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
    text: string,
): Promise<GroupDocument | null> {
  const regexResult = groupRegex.exec(text);

  if (regexResult?.length) {
    const groupName = regexResult.slice(1).join('-').toUpperCase();
    const group = await groups.findOne({name: groupName});
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
    group: GroupDocument,
): string {
  if (!schedule) {
    return 'Не удалось получить расписание';
  }

  let message = `${group?.name + '\n' || ''}${schedule.date}\n\n`;

  if (schedule.lessons.length > 0) {
    for (const lesson of schedule.lessons) {
      message += lesson.num + ' ' + numToTime(lesson.num) + '\n';
      message += lesson.title + '\n';
      message += lesson.teachername + '\n';
      message += lesson.cab + '\n\n';
    }
  } else {
    message += 'Расписание не найдено';
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
  console.log(a.lessons);
  console.log(b.lessons);
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Вызывает console.log с добавлением времени в начало сообщения
 * @param {string} message сообщение
 */
export function log(message: string) {
  const time = `[${dayjs().format('HH:mm:ss')}]`;
  console.log([time, message].join(' '));
}

/**
 * Отправляет расписание на два дня
 * @param {Context} ctx контекст
 * @param {Dayjs} date дата (по умолчанию сегодня)
 */
export async function sendSchedule(ctx: MyContext, date = dayjs()) {
  const group = ctx.session?.group;
  if (!group) return false;

  const firstDate = getNextWorkDate(date);
  const secondDate = getNextWorkDate(firstDate.add(1, 'day'));

  const firstSchedule = await fetchSchedule(group, firstDate);
  const secondSchedule = await fetchSchedule(group, secondDate);

  await ctx.reply(getScheduleMessage(firstSchedule, group));
  await ctx.reply(getScheduleMessage(secondSchedule, group));

  return true;
}

// export default {
//   getScheduleMessage,
//   getGroupFromString,
//   getNextWorkDate,
//   numToTime,
//   removeSubscription,
//   fetchSchedule,
//   compareSchedule,
//   log,
//   sendSchedule,
//   groupRegex,
// };