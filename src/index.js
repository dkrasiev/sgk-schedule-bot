require('dotenv').config();
require('mongoose').connect(process.env.MONGODB_URI);
const dayjs = require('dayjs');

const bot = require('./bot');
const {chats, groups} = require('./models');
const {
  fetchSchedule,
  getNextWorkDate,
  log,
  compareSchedule,
} = require('./utils');

/**
 * Обработка событий бота
 * @param {any} event http request
 * @return {any} http response
 */
module.exports.handler = async function(event) {
  const message = JSON.parse(event.body);
  await bot.handleUpdate(message);
  return {
    statusCode: 200,
    body: '',
  };
};

/**
 * Проверяет обновления расписания
 */
module.exports.update = async function() {
  log('checking schedule...');

  const allChats = await chats.find();
  const chatsWithSubscription = allChats.filter(
      (chat) => chat.subscription.groupId,
  );
  const groupIds = new Set(
      chatsWithSubscription.map((chat) => chat.subscription.groupId),
  );

  const schedules = {};
  for (const groupId of groupIds) {
    const group = await groups.findOne({id: groupId});
    const dateNext = getNextWorkDate(dayjs().add(1, 'day'));
    const schedule = await fetchSchedule(group, dateNext);

    schedules[groupId] = schedule;
  }

  for (const chat of chatsWithSubscription) {
    const group = await groups.findOne({id: chat.subscription.groupId});
    const newSchedule = schedules[chat.subscription.groupId];

    const lastSchedule = chat.toObject().subscription.lastSchedule;
    lastSchedule.lessons.forEach((lesson) => {
      delete lesson._id;
    });

    const isScheduleNew =
      !compareSchedule(lastSchedule, newSchedule) &&
      newSchedule?.lessons?.length;

    if (isScheduleNew) {
      log(group.name + ' расписание изменилось');

      chat.subscription.lastSchedule = newSchedule;
      await chat.save();

      const message = getScheduleMessage(newSchedule, group);

      await bot.telegram.sendMessage(chat.id, 'Вышло новое расписание!');
      await bot.telegram.sendMessage(chat.id, message);
    } else {
      log(group.name + ' расписание не изменилось');
    }
  }
};

module.exports.update();
