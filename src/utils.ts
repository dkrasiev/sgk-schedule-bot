import axios from 'axios';
import dayjs, {Dayjs} from 'dayjs';
import {groups} from './models';
import {ChatDocument} from './models/chat.model';
import {GroupDocument} from './models/group.model';
import {LessonTime} from './types/lesson.type';
import Schedule from './types/schedule.type';

const groupRegex = new RegExp(/([А-я]{1,3})[\W]?(\d{2})[\W]?(\d{2})/);

interface Collection<T> {
  [key: string]: T;
}

/**
 * Преобразует номер пары в время пары
 * @param {string} num номер пары
 * @return {string} время пары
 */
export function numToTime(num: string): LessonTime {
  const times: Collection<string> = {
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

  const selectedTime = times[num];

  const [from, to] = selectedTime.split('-').map((time) => {
    const date = dayjs();
    const [hours, minutes] = time
        .split(':')
        .map((value) => Number.parseInt(value));

    return date.set('hours', hours).set('minutes', minutes);
  });

  return {from, to};
}

/**
 * Получает расписание
 * @param {GroupDocument} group группа
 * @param {Dayjs} date дата
 * @return {Schedule} расписание
 */
export async function fetchSchedule(
    group: GroupDocument,
    date: Dayjs
): Promise<Schedule> {
  const {data} = await axios.get<Schedule>(
      [
        'https://asu.samgk.ru/api/schedule',
        group.id,
        date.format('YYYY-MM-DD'),
      ].join('/')
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
    text: string
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
    group: GroupDocument
): string {
  if (!schedule) return 'Ошибка: не удалось получить расписание';

  const header = `${group?.name + '\n' || ''}${schedule.date}\n\n`;
  let message = header;

  if (schedule.lessons.length > 0) {
    for (const lesson of schedule.lessons) {
      const {from, to} =
        typeof lesson.num === 'string' ? numToTime(lesson.num) : lesson.num;

      const time = `${from.format('HH:mm')}-${to.format(
          'HH:mm'
      )}`;

      message += lesson.num + ' ' + time + '\n';
      message += lesson.title + '\n';
      message += lesson.teachername + '\n';
      message += lesson.cab + '\n\n';
    }
  } else {
    message += 'Расписания нет';
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
  const time = `[${dayjs().format('HH:mm:ss')}]`;
  console.log([time, message].join(' '));
}
