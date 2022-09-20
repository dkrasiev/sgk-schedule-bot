import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
if (!process.env.MONGODB_URI) {
  console.log('MONGODB_URI required');
  process.exit();
}
mongoose.connect(process.env.MONGODB_URI);

import dayjs from 'dayjs';

import bot from './bot';
import {chats, groups} from './models';
import {
  fetchSchedule,
  getNextWorkDate,
  log,
  compareSchedule,
  getScheduleMessage,
} from './utils';
import Schedule from './types/schedule.type';

/**
 * Обработка событий бота
 * @param {any} event http request
 * @return {any} http response
 */
module.exports.handler = async function(event: any) {
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
  const groupIds = new Set<number | undefined>(
      chatsWithSubscription.map((chat) => chat.subscription.groupId),
  );

  type Schedules = {
    [key: number]: Schedule;
  };

  const schedules: Schedules = {};
  for (const groupId of groupIds) {
    const group = await groups.findOne({id: groupId});
    if (!group || !groupId) return;

    const dateNext = getNextWorkDate(dayjs().add(1, 'day'));
    const schedule = await fetchSchedule(group, dateNext);

    schedules[groupId] = schedule;
  }

  for (const chat of chatsWithSubscription) {
    const group = await groups.findOne({id: chat.subscription.groupId}, '-_id');
    if (!group || !chat.subscription.groupId) return;

    const newSchedule = schedules[chat.subscription.groupId];

    const lastSchedule = chat.subscription.lastSchedule;

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
