require('dotenv').config();
require('mongoose').connect(process.env.MONGODB_URI);
const dayjs = require('dayjs');

const bot = require('./bot');
const {chats, groups} = require('./models');
const {
  fetchSchedule,
  getNextWorkDate,
  getGroupFromString,
  getScheduleMessage,
  removeSubscription,
} = require('./utils');

bot.on('message', async (ctx, next) => {
  if (!(await chats.findOne({id: ctx.chat.id}))) {
    await chats.create({id: ctx.chat.id});
  }

  next();
});

bot.start(async (ctx) => {
  const name = ctx.from.last_name ?
    `${ctx.from.first_name} ${ctx.from.last_name}` :
    ctx.from.first_name;

  let startMessage = `Привет, ${name}!\n`;
  startMessage += 'Чтобы узнать как я работаю, напиши /help';

  await ctx.reply(startMessage);
});

bot.help(async (ctx) => {
  const helpMessage = 'Для получения расписания введи команду /schedule';
  await ctx.reply(helpMessage);
});

bot.on('text', async (ctx, next) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const groupFromMessage = await getGroupFromString(ctx.message.text);
  const groupFromChat = await groups.findOne({id: chat.defaultGroup});

  ctx.data = {
    group: groupFromMessage || groupFromChat,
  };

  next();
});

bot.command('groups', async (ctx) => {
  let groupsArray = await groups.find();

  groupsArray = groupsArray
      .map((group) => group.name)
      .sort((a, b) => a.localeCompare(b));

  await ctx.reply(groupsArray.join('\n'));
});

bot.command('schedule', async (ctx) => {
  try {
    const group = ctx.data.group;

    const firstDate = getNextWorkDate(dayjs());
    const secondDate = getNextWorkDate(firstDate.add(1, 'day'));

    const firstSchedule = await fetchSchedule(group, firstDate);
    const secondSchedule = await fetchSchedule(group, secondDate);

    await ctx.reply(getScheduleMessage(firstSchedule, group));
    await ctx.reply(getScheduleMessage(secondSchedule, group));
  } catch (error) {
    bot.telegram.sendMessage(748299957, error?.message || error);
  }
});

bot.command('setgroup', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = ctx.data.group;

  if (group) {
    chat.defaultGroup = group.id;
    await chat.save();
    await ctx.reply('Установлена группа ' + group.name);
  } else {
    await ctx.reply('Группа не найдена');
  }
});

bot.command('subscribe', async (ctx) => {
  const chat = await chats.findOne({id: ctx.chat.id});
  const group = ctx.data.group;

  if (group) {
    const firstDate = getNextWorkDate(dayjs());
    const secondDate = getNextWorkDate(firstDate);

    const schedule = await fetchSchedule(group, secondDate);
    const newSubscription = {
      groupId: group.id,
      lastSchedule: schedule,
    };
    chat.subscription = newSubscription;
    await chat.save();

    await ctx.reply(
        `Вы подписались на обновления расписания группы ${group.name}`,
    );
  } else {
    await ctx.reply('Группа не найдена');
  }
});

bot.command('unsubscribe', async (ctx) => {
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
