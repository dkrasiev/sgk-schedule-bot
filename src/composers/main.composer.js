const dayjs = require('dayjs');
const {Composer} = require('telegraf');
const {chats, groups} = require('../models');
const {
  getGroupFromString,
  getNextWorkDate,
  fetchSchedule,
  removeSubscription} = require('../utils');

const composer = new Composer();

composer.command('groups', async (ctx) => {
  let groupsArray = await groups.find();

  groupsArray = groupsArray
      .map((group) => group.name)
      .sort((a, b) => a.localeCompare(b));

  await ctx.reply(groupsArray.join('\n'));
});

composer.command('setgroup', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = await getGroupFromString(ctx.message.text);

  if (group) {
    chat.defaultGroup = group.id;
    await chat.save();
    await ctx.reply('Установлена группа ' + group.name);
  } else {
    await ctx.reply('Группа не найдена или Вы ничего не ввели');
  }
});

composer.command('subscribe', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = ctx.data.group;

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
    await ctx.reply('Укажите номер группы после команды\n\n' +
    'Пример команды:\n' +
    '/subscribe ИС-19-04');
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

composer.command('removedefault', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});

  if (chat.defaultGroup) {
    chat.defaultGroup = null;
    await chat.save();
    await ctx.reply('Группа по умолчанию удалена');
    return;
  }

  await ctx.reply('Группа по умолчанию не выбрана');
});

module.exports = composer;
