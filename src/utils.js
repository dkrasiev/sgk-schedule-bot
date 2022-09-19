const {default: axios} = require('axios');
const {groups} = require('./models');

const groupRegex = new RegExp(/([А-я]{1,3})[\W]?(\d{2})[\W]?(\d{2})/g);

/**
 * Преобразует номер пары в время пары
 * @param {string | number} num номер пары
 * @return {string} время пары
 */
function numToTime(num) {
  const times = {
    1: '08:25-10:00',
    2: '10:10-11:45',
    3: '12:15-13:50',
    4: '14:00-15:35',
    5: '15:45-17:20',
    6: '17:30-19:05',
    7: '19:15-20:50',
    1.1: '08:25-09:10',
    1.2: '09:15-10:00',
    2.1: '10:10-10:55',
    2.2: '11:00-11:45',
    3.1: '12:15-13:00',
    3.2: '13:05-13:50',
    4.1: '14:00-14:45',
    4.2: '14:50-15:35',
    5.1: '15:45-16:30',
    5.2: '16:35-17:20',
    6.1: '17:30-18:15',
    6.2: '18:20-19:05',
    7.1: '19:15-20:00',
    7.2: '20:05-20:50',
  };
  return times[num];
}

/**
 * Получает расписание
 * @param {any} group группа
 * @param {dayjs.Dayjs} date дата
 * @return {any} расписание
 */
async function fetchSchedule(group, date) {
  const response = await axios.get(
      [
        'https://asu.samgk.ru/api/schedule',
        group.id,
        date.format('YYYY-MM-DD'),
      ].join('/'),
  );
  const schedule = response.data;

  return schedule;
}

/**
 * Возвращает следующий будний день
 * @param {dayjs.Dayjs} date дата от которой искать
 * @return {dayjs.Dayjs} следующий будний день
 */
function getNextWorkDate(date) {
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
 * @param {any} chat объект чата
 * @return {boolean} получилось ли отписаться
 */
async function removeSubscription(chat) {
  if (chat?.subscription?.groupId) {
    chat.subscription = null;
    await chat.save();
    return true;
  }
  return false;
}

/**
 * Находит учебную группу в тексте и возвращает ее
 * @param {string} text текст
 * @return {any} учебная группа
 */
async function getGroupFromString(text) {
  const regexResult = groupRegex.exec(text);

  if (regexResult) {
    const groupName = regexResult.slice(1).join('-').toUpperCase();
    return await groups.findOne({name: groupName});
  }

  return null;
}

/**
 * Получение сообщения для отправки пользователю
 * @param {any} schedule объект расписания
 * @param {any} group группа для которой расписание
 * @return {string} сообщение для пользователя
 */
function getScheduleMessage(schedule, group) {
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
 * @param {any} a первое расписание
 * @param {any} b второе расписание
 * @return {boolean} результат сравнения
 */
function compareSchedule(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

/**
 * Вызывает console.log с добавлением времени в начало сообщения
 * @param {string} message сообщение
 */
function log(message) {
  const time = `[${dayjs().format('HH:mm:ss:SSS')}]`;
  console.log([time, message].join(' '));
}

module.exports = {
  getScheduleMessage,
  getGroupFromString,
  getNextWorkDate,
  numToTime,
  removeSubscription,
  fetchSchedule,
  compareSchedule,
  log,
  groupRegex,
};
