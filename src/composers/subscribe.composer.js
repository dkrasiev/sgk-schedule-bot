const dayjs = require('dayjs');
const {chats, groups} = require('../models');
const {
  getNextWorkDate,
  fetchSchedule,
  removeSubscription,
} = require('../utils');

const {Composer} = require('telegraf');
const composer = new Composer();

composer.command('subscribe', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = ctx.session.group;

  if (group) {
    const firstDate = getNextWorkDate(dayjs());
    const secondDate = getNextWorkDate(firstDate);

    const schedule = await fetchSchedule(group, secondDate);

    chat.subscription = {
      groupId: group.id,
      lastSchedule: schedule,
    };
    await chat.save();

    await ctx.reply(
        `Вы подписались на обновления расписания группы ${group.name}`,
    );
  } else {
    await ctx.reply(
        'Укажите номер группы после команды\n\n' +
        'Пример команды:\n' +
        '/subscribe ИС-19-04',
    );
  }
});

composer.command('unsubscribe', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = await groups.findOne({id: chat.subscription?.groupId});

  if (await removeSubscription(chat)) {
    await ctx.reply(
        `Вы отписались от обновлений расписания группы ${group.name}`,
    );
  } else {
    await ctx.reply('Вы не подписаны на обновления расписания');
  }
});

module.exports = composer;
