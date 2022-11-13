import dotenv from 'dotenv';
dotenv.config();

import * as db from './db';
db.connect();

import dayjs, {Dayjs} from 'dayjs';

import bot from './bot';
import {chats, groups} from './models';
import {
  getNextWorkDate,
  log,
  compareSchedule,
  getScheduleMessage,
  fetchManyGroups,
} from './utils';
import Schedule from './types/schedule.type';
import {ChatDocument} from './models/chat.model';
import {GroupDocument} from './models/group.model';

/**
 * Обработка событий бота
 * @param {any} event http request
 * @return {any} http response
 */
module.exports.handler = async function(event: any): Promise<any> {
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
  log('start checking schedule');
  const chatsWithSubscription = await chats.where('subscription.groupId').gt(0);
  log('chats have been loaded');
  const subscribedGroups = await groups.find({
    id: {
      $in: chatsWithSubscription.map(
          (chat: ChatDocument) => chat.subscription.groupId,
      ),
    },
  });
  log('groups have been loaded');

  log('fetching schedules...');
  const nextDate: Dayjs = getNextWorkDate(dayjs().add(1, 'day'));
  const schedules: Map<number, Schedule> = await fetchManyGroups(
      subscribedGroups.map((group: GroupDocument) => group.id),
      nextDate,
  );

  log('compare schedules...');
  for (const chat of chatsWithSubscription) {
    const group = subscribedGroups.find(
        (group) => group.id === chat.subscription.groupId,
    );
    if (!group || !chat.subscription.groupId) continue;

    const newSchedule = schedules.get(chat.subscription.groupId);
    if (!newSchedule) continue;

    const lastSchedule = chat.subscription.lastSchedule;

    const isEquals = compareSchedule(lastSchedule, newSchedule);
    const isScheduleNew = isEquals === false && newSchedule.lessons.length;

    try {
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
    } catch (error) {
      log('ошибка при отправки сообщения в ' + chat.id);
    }
  }
  log('done');
};

// TODO: replace with node-cron
if (process.env.LAUNCH) {
  setInterval(() => {
    module.exports.update();
  }, 15 * 60 * 1000);
}
